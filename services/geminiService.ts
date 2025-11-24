import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SweetRecipe } from "../types";

// Helper to get key safely
const getApiKey = () => process.env.API_KEY || '';

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
            items: { 
                type: Type.OBJECT,
                properties: {
                    instruction: { type: Type.STRING, description: "工程の詳細な日本語説明。" },
                    visualDescription: { type: Type.STRING, description: "この工程の様子を表す手書き風スケッチのための英語の描写（例：'Sketch of a hand whisking egg whites in a bowl'）。" }
                },
                required: ["instruction", "visualDescription"]
            },
            description: "ステップバイステップの作り方と、その視覚的描写。"
        },
        costPrice: { type: Type.STRING, description: "推定原価（円表記）。指定がある場合はそれに従う。" },
        sellingPrice: { type: Type.STRING, description: "販売価格（円表記）。指定がある場合はそれに従う。" },
        imagePrompt: { type: Type.STRING, description: "完成写真用：AI画像生成のための非常に詳細な英語のプロンプト。照明、盛り付け、質感、マクロなディテールに焦点を当てる。" },
        flavorProfile: { type: Type.STRING, description: "主な味の構成（例：'ほろ苦い、柑橘系、クリーミー'）。" }
    },
    required: ["name", "description", "ingredients", "steps", "costPrice", "sellingPrice", "imagePrompt", "flavorProfile"]
};

interface GenerationOptions {
    keywords: string;
    costConstraint?: string;
    priceConstraint?: string;
    previousRecipe?: SweetRecipe;
}

export const generateRecipeConfig = async (options: GenerationOptions): Promise<SweetRecipe> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment configuration.");
    }
    
    // Initialize AI instance per request to ensure key is present
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const { keywords, costConstraint, priceConstraint, previousRecipe } = options;

    try {
        let systemInstruction = `
            あなたは三ツ星レストランで働く世界最高峰のアヴァンギャルドなパティシエです。
            あなたの仕事は、ユーザーの入力に基づいて**斬新で創造的、そして視覚的に素晴らしい**デザートを考案することです。
            
            基本ルール:
            1. 単なる普通のケーキではなく、脱構築、分子ガストロノミー、ユニークな食感、芸術的な盛り付けを意識してください。
            2. 説明は**お客様に分かりやすく、かつ魅力的**な日本語で行ってください。
            3. 通貨は**日本円（円）**を使用してください。
            4. **imagePrompt** は、完成品の高品質な写真用に詳細な英語で記述してください。
            5. **steps** の **visualDescription** は、レシピ本の挿絵のような「シンプルな手書きスケッチ」を生成するための英語の指示です。
        `;

        // Add constraints to system instruction
        if (costConstraint || priceConstraint) {
            systemInstruction += `
            
            【重要：価格設定の制約】
            以下の価格設定を厳守してレシピを考案してください：
            ${costConstraint ? `- 目標原価: ${costConstraint}前後` : ''}
            ${priceConstraint ? `- 目標売値: ${priceConstraint}前後` : ''}
            価格に見合った材料選びと手間のかけ方を調整してください。
            `;
        }

        let userPrompt = "";
        
        if (previousRecipe) {
            systemInstruction += `
            あなたは現在、既存のレシピを改良（アレンジ）する作業を行っています。
            前回のレシピの良さを活かしつつ、新しい要望（追加キーワード）を取り入れて、レシピを進化させてください。
            `;
            userPrompt = `
            【元になるレシピ】
            名前: ${previousRecipe.name}
            特徴: ${previousRecipe.description}
            構成: ${previousRecipe.flavorProfile}

            【追加の要望・キーワード】
            ${keywords}

            上記の元のレシピをベースに、追加の要望を取り入れた新しいレシピを作成してください。
            `;
        } else {
            userPrompt = `以下のキーワードを使って、ユニークなデザートのコンセプトを創り出してください: ${keywords}`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
                temperature: 1,
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
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key is missing.");
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt + " Professional food photography, 8k resolution, soft studio lighting, macro shot, highly detailed, appetizing, cinematic depth of field." }
                ]
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });
        return extractImageFromResponse(response);
    } catch (error) {
        console.error("Error generating main image:", error);
        // Do not throw here to allow partial success (recipe without image)
        return ""; 
    }
};

export const generateStepIllustration = async (prompt: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return ""; 
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    try {
        // Specific style for step illustrations
        const artStyle = "Black and white pencil sketch, hand-drawn technical illustration, cookbook style, simple lines, white background, minimalist, high contrast.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: `${prompt}. ${artStyle}` }
                ]
            },
            config: {
                imageConfig: { aspectRatio: "4:3" }
            }
        });
        return extractImageFromResponse(response);
    } catch (error) {
        console.error("Error generating step illustration:", error);
        return ""; 
    }
};

const extractImageFromResponse = (response: any): string => {
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("No image generated");
};