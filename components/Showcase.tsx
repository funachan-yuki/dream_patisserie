import React from 'react';
import { GeneratedSweet } from '../types';
import { RecipeCard } from './RecipeCard';

interface ShowcaseProps {
    data: GeneratedSweet;
}

export const Showcase: React.FC<ShowcaseProps> = ({ data }) => {
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in pb-20">
            
            {/* Main Visual Panel */}
            <div className="glass-panel border-0 border-t border-patisserie-gold/30 relative overflow-hidden mb-12">
                <div className="grid lg:grid-cols-5 min-h-[600px]">
                    
                    {/* Image Section (Takes up 3/5 on large screens) */}
                    <div className="lg:col-span-3 relative overflow-hidden min-h-[400px] lg:min-h-full border-b lg:border-b-0 lg:border-r border-patisserie-gold/20">
                        {data.imageUrl ? (
                            <div className="w-full h-full relative group">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
                                    style={{ backgroundImage: `url(${data.imageUrl})` }}
                                />
                                {/* Vignette Overlay */}
                                <div className="absolute inset-0 bg-radial-gradient from-transparent to-patisserie-dark/60"></div>
                                
                                {/* Text Overlay on Image */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-patisserie-dark via-patisserie-dark/80 to-transparent">
                                    <h1 className="font-display text-4xl md:text-6xl text-white mb-2 drop-shadow-2xl tracking-tight leading-none">
                                        {data.recipe.name}
                                    </h1>
                                    <div className="w-20 h-1 bg-patisserie-gold mt-4"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-patisserie-charcoal flex flex-col items-center justify-center p-8">
                                <div className="loader mb-6"></div>
                                <span className="font-display text-patisserie-gold/80 tracking-[0.2em] animate-pulse">PLATING...</span>
                            </div>
                        )}
                    </div>

                    {/* Intro/Flavor Text Section (2/5) */}
                    <div className="lg:col-span-2 bg-patisserie-dark/80 p-8 md:p-12 flex flex-col justify-center relative">
                        {/* Decorative Background Icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-[0.03] text-patisserie-gold pointer-events-none font-display">
                            &
                        </div>

                        <div className="relative z-10 text-center lg:text-left space-y-6">
                            <span className="font-script text-4xl text-patisserie-gold/60">Chef's Creation</span>
                            <p className="font-serif text-patisserie-cream/80 leading-loose text-lg">
                                {data.recipe.description.split('。')[0]}。
                            </p>
                            <div className="pt-8 flex justify-center lg:justify-start">
                                <div className="w-px h-16 bg-gradient-to-b from-patisserie-gold to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Recipe Scroll */}
            <div className="max-w-5xl mx-auto px-4 md:px-8">
                <RecipeCard recipe={data.recipe} />
            </div>

            {/* Signature Footer */}
            <div className="mt-20 text-center opacity-40">
                <span className="font-script text-5xl text-white">Bon Appétit</span>
            </div>
        </div>
    );
};