import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { Showcase } from './components/Showcase';
import { generateRecipeConfig, generateSweetImage } from './services/geminiService';
import { GeneratedSweet, LoadingState } from './types';

const App: React.FC = () => {
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
    const [currentSweet, setCurrentSweet] = useState<GeneratedSweet | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async (keywords: string, cost: string, price: string) => {
        try {
            setError(null);
            const isRefining = !!currentSweet;
            const previousRecipe = isRefining ? currentSweet.recipe : undefined;

            setLoadingState(LoadingState.GENERATING_RECIPE);
            
            const recipe = await generateRecipeConfig({
                keywords, 
                costConstraint: cost, 
                priceConstraint: price,
                previousRecipe
            });
            
            setCurrentSweet({
                recipe,
                imageUrl: null
            });

            setLoadingState(LoadingState.GENERATING_IMAGE);

            const imageUrl = await generateSweetImage(recipe.imagePrompt);
            
            setCurrentSweet({
                recipe,
                imageUrl
            });

            setLoadingState(LoadingState.COMPLETE);

        } catch (err: any) {
            console.error(err);
            
            let errorMessage = "申し訳ありません。現在シェフが多忙のようです。少し時間を置いて再度お試しください。";
            
            // Analyze the error message to give better feedback
            const errString = err.toString();
            
            if (errString.includes("API Key is missing")) {
                errorMessage = "システムエラー：APIキーが設定されていません。Vercel等の環境変数設定をご確認ください。";
            } else if (errString.includes("429")) {
                errorMessage = "現在、注文が殺到しておりシェフの手が回りません（レートリミット）。1分ほど待ってから再注文してください。";
            } else if (errString.includes("503") || errString.includes("Overloaded")) {
                errorMessage = "厨房が大変混雑しております（サーバー過負荷）。少し待ってから再注文してください。";
            } else if (errString.includes("SAFETY")) {
                errorMessage = "申し訳ありません。そのキーワードでのスイーツ作成は、店のポリシーによりお断りさせていただきました（安全フィルター）。";
            }

            setError(errorMessage);
            setLoadingState(LoadingState.ERROR);
        }
    };

    const handleReset = () => {
        setCurrentSweet(null);
        setError(null);
        setLoadingState(LoadingState.IDLE);
    };

    return (
        <div className="min-h-screen bg-patisserie-dark relative overflow-x-hidden selection:bg-patisserie-gold selection:text-patisserie-dark">
            
            {/* Background Layers */}
            <div className="fixed inset-0 bg-marble bg-cover bg-fixed opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col min-h-screen">
                
                {/* Header */}
                <header className="pt-16 pb-12 text-center">
                    <div className="inline-block mb-4 animate-fade-in">
                        <span className="block text-xs font-display tracking-[0.5em] text-patisserie-gold mb-2">EST. 2024</span>
                        <h1 className="font-display text-5xl md:text-7xl text-white tracking-widest leading-none">
                            L'ATELIER <span className="text-patisserie-gold font-normal">AI</span>
                        </h1>
                    </div>
                    <p className="font-serif text-patisserie-cream/50 italic text-sm md:text-base tracking-widest uppercase animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                        The Art of Algorithmic Patisserie
                    </p>
                </header>

                <main className="flex-grow container mx-auto px-4 flex flex-col items-center">
                    
                    <InputSection 
                        onGenerate={handleGenerate}
                        onReset={handleReset}
                        isLoading={loadingState === LoadingState.GENERATING_RECIPE || loadingState === LoadingState.GENERATING_IMAGE}
                        isRefining={!!currentSweet && loadingState !== LoadingState.GENERATING_RECIPE && loadingState !== LoadingState.GENERATING_IMAGE}
                    />

                    {/* Status Messages */}
                    {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR && (
                        <div className="text-center my-12 space-y-4">
                            <div className="loader"></div>
                            <p className="font-display text-lg text-patisserie-gold tracking-widest animate-pulse">
                                {loadingState === LoadingState.GENERATING_RECIPE ? "CONCEPTUALIZING..." : "PLATING THE DESSERT..."}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="max-w-xl mx-auto bg-red-900/30 border border-red-500/30 text-red-100 px-8 py-6 rounded-sm backdrop-blur-md font-serif text-center animate-fade-in shadow-lg">
                            <div className="mb-2 text-patisserie-gold text-2xl">⚠</div>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Result Showcase */}
                    {(currentSweet || loadingState === LoadingState.COMPLETE) && currentSweet && (
                        <Showcase data={currentSweet} />
                    )}

                </main>

                <footer className="py-8 text-center border-t border-white/5 mt-auto">
                    <p className="text-patisserie-cream/20 font-display text-[10px] uppercase tracking-[0.3em]">
                        Powered by Gemini 2.5 Flash • Excellence in every byte
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;