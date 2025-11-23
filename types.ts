export interface SweetRecipe {
    name: string;
    description: string;
    ingredients: string[];
    steps: string[];
    costPrice: string;
    sellingPrice: string;
    imagePrompt: string;
    flavorProfile: string;
}

export interface GeneratedSweet {
    recipe: SweetRecipe;
    imageUrl: string | null;
}

export enum LoadingState {
    IDLE = 'IDLE',
    GENERATING_RECIPE = 'GENERATING_RECIPE',
    GENERATING_IMAGE = 'GENERATING_IMAGE',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR'
}
