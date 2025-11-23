import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SweetRecipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The elegant French or English name of the dessert." },
        description: { type: Type.STRING, description: "A poetic and appetizing description of the dessert." },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of ingredients with precise quantities."
        },
        steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step preparation instructions."
        },
        costPrice: { type: Type.STRING, description: "Estimated cost to produce (e.g., '¥450')." },
        sellingPrice: { type: Type.STRING, description: "Suggested retail price for a high-end boutique (e.g., '¥1200')." },
        imagePrompt: { type: Type.STRING, description: "A highly detailed visual description for an AI image generator to create a photorealistic image of this dessert. Focus on lighting, plating, textures, and macro details." },
        flavorProfile: { type: Type.STRING, description: "Key flavor notes (e.g., 'Bittersweet, Citrusy, Creamy')." }
    },
    required: ["name", "description", "ingredients", "steps", "costPrice", "sellingPrice", "imagePrompt", "flavorProfile"]
};

export const generateRecipeConfig = async (keywords: string): Promise<SweetRecipe> => {
    try {
        const systemInstruction = `
            あなたは三ツ星レストランで働く世界最高峰のアヴァンギャルドなパティシエです。
            あなたの仕事は、ユーザーのキーワードに基づいて**斬新で創造的、そして視覚的に素晴らしい**デザートを考案することです。
            単なる普通のケーキではなく、脱構築、分子ガストロノミー、ユニークな食感、芸術的な盛り付けを意識してください。
            レシピはプロフェッショナルなものでなければなりません。価格設定は高級店に見合ったものにしてください。
            
            出力に関するルール:
            1. **imagePrompt** は、AI画像生成ツールが高品質な画像を生成できるように、英語で非常に詳細に記述してください。
            2. それ以外の項目（description, ingredients, steps, flavorProfileなど）はすべて**日本語**で記述してください。
            3. 通貨は**日本円（¥）**を使用してください。
            4. デザートの名前（name）はフランス語または英語で、日本語のカタカナ読みをカッコ書きなどで添えても良いです。
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
        // Using gemini-2.5-flash-image for standard generation, could upgrade to pro-image-preview for higher quality if needed,
        // but flash-image is generally faster and sufficient for this demo.
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