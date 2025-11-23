import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SweetRecipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "スイーツの優雅な名前（フランス語または英語）。日本語の読み仮名も添えてください。" },
        description: { type: Type.STRING, description: "このスイーツの魅力を伝える、詩的で食欲をそそる日本語の説明文。" },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "正確な分量を含む材料リスト（日本語）。"
        },
        steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "ステップバイステップの作り方（日本語）。"
        },
        costPrice: { type: Type.STRING, description: "推定原価（例: '450円'）。" },
        sellingPrice: { type: Type.STRING, description: "高級店での推奨販売価格（例: '1,200円'）。" },
        imagePrompt: { type: Type.STRING, description: "AI画像生成のための非常に詳細な英語のプロンプト。照明、盛り付け、質感、マクロなディテールに焦点を当てる。" },
        flavorProfile: { type: Type.STRING, description: "主な味の構成（例: 'ほろ苦い、柑橘系、クリーミー'）。" }
    },
    required: ["name", "description", "ingredients", "steps", "costPrice", "sellingPrice", "imagePrompt", "flavorProfile"]
};

export const generateRecipeConfig = async (keywords: string): Promise<SweetRecipe> => {
    try {
        const systemInstruction = `
            あなたは三ツ星レストランで働く世界最高峰のアヴァンギャルドなパティシエです。
            あなたの仕事は、ユーザーのキーワードに基づいて**斬新で創造的、そして視覚的に素晴らしい**デザートを考案することです。
            単なる普通のケーキではなく、脱構築、分子ガストロノミー、ユニークな食感、芸術的な盛り付けを意識してください。
            
            しかし、説明は**お客様に分かりやすく、かつ魅力的**な日本語で行ってください。
            専門用語を使っても良いですが、その美味しさが伝わるように表現してください。
            
            出力に関するルール:
            1. **imagePrompt** は、AI画像生成ツールが高品質な画像を生成できるように、英語で非常に詳細に記述してください。
            2. それ以外の項目（description, ingredients, steps, flavorProfileなど）はすべて**日本語**で記述してください。
            3. 通貨は**日本円（円）**を使用してください。
            4. デザートの名前（name）はフランス語または英語で、日本語のカタカナ読みを必ず添えてください。
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `以下のキーワードを使って、ユニークなデザートのコンセプトを創り出してください: ${keywords}`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
                temperature: 1, // High creativity
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as SweetRecipe;

    } catch (error) {
        console.error("Error generating recipe:", error);
        throw error;
    }
};

export const generateSweetImage = async (prompt: string): Promise<string> => {
    try {
        // Using gemini-2.5-flash-image for standard generation
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt + " Professional food photography, 8k resolution, soft studio lighting, macro shot, highly detailed, appetizing, cinematic depth of field." }
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};