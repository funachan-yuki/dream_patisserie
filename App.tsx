import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { Showcase } from './components/Showcase';
import { generateRecipeConfig, generateSweetImage } from './services/geminiService';
import { GeneratedSweet, LoadingState } from './types';

const App: React.FC = () => {
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
    const [currentSweet, setCurrentSweet] = useState<GeneratedSweet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (keywords: string) => {
        try {
            setError(null);
            setLoadingState(LoadingState.GENERATING_RECIPE);
            
            // Step 1: Generate Text/Recipe
            const recipe = await generateRecipeConfig(keywords);
            
            // Temporary state with no image yet
            setCurrentSweet({
                recipe,
                imageUrl: null
            });

            setLoadingState(LoadingState.GENERATING_IMAGE);

            // Step 2: Generate Image
            const imageUrl = await generateSweetImage(recipe.imagePrompt);
            
            setCurrentSweet({
                recipe,
                imageUrl
            });

            setLoadingState(LoadingState.COMPLETE);

        } catch (err) {
            console.error(err);
            setError("申し訳ありません。現在シェフが多忙のようです。少し時間を置いて再度お試しください。");
            setLoadingState(LoadingState.ERROR);
        }
    };

    return (
        <div className="min-h-screen bg-patisserie-dark bg-marble bg-cover bg-fixed bg-blend-multiply text-patisserie-cream overflow-x-hidden selection:bg-patisserie-gold selection:text-patisserie-dark">
            <div className="min-h-screen bg-black/60 backdrop-blur-sm flex flex-col">
                
                {/* Header */}
                <header className="pt-12 pb-8 text-center relative z-10">
                    <div className="w-16 h-1 bg-patisserie-gold mx-auto mb-6"></div>
                    <h1 className="font-display text-4xl md:text-6xl text-white tracking-widest mb-2">
                        L'ATELIER <span className="text-patisserie-gold">IA</span>
                    </h1>
                    <p className="font-serif text-patisserie-gold/80 italic text-lg tracking-wide">
                        AIパティシエが贈る、至高のスイーツ提案
                    </p>
                </header>

                <main className="flex-grow container mx-auto px-4 pb-20 flex flex-col items-center">
                    
                    <InputSection 
                        onGenerate={handleGenerate} 
                        isLoading={loadingState === LoadingState.GENERATING_RECIPE || loadingState === LoadingState.GENERATING_IMAGE} 
                    />

                    {/* Status Messages */}
                    {loadingState === LoadingState.GENERATING_RECIPE && (
                        <div className="text-center animate-pulse mt-8">
                            <p className="font-display text-xl text-patisserie-gold">アイデアを練っています...</p>
                            <p className="font-serif text-sm text-patisserie-cream/60">フレーバーの組み合わせと構成を設計中</p>
                        </div>
                    )}

                    {loadingState === LoadingState.GENERATING_IMAGE && (
                        <div className="text-center animate-pulse mt-8">
                            <p className="font-display text-xl text-patisserie-gold">仕上げの盛り付け中...</p>
                            <p className="font-serif text-sm text-patisserie-cream/60">光と影を調整し、美しいビジュアルを生成しています</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/50 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg mt-4 backdrop-blur-md">
                            {error}
                        </div>
                    )}

                    {/* Result Showcase */}
                    {(currentSweet || loadingState === LoadingState.COMPLETE) && currentSweet && (
                        <Showcase data={currentSweet} />
                    )}

                </main>

                <footer className="py-6 text-center text-patisserie-cream/30 font-sans text-xs uppercase tracking-widest border-t border-white/5">
                    <p>© {new Date().getFullYear()} L'Atelier IA • Powered by Gemini 2.5 Flash</p>
                </footer>
            </div>
        </div>
    );
};

export default App;