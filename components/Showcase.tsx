import React from 'react';
import { GeneratedSweet } from '../types';
import { RecipeCard } from './RecipeCard';

interface ShowcaseProps {
    data: GeneratedSweet;
}

export const Showcase: React.FC<ShowcaseProps> = ({ data }) => {
    return (
        <div className="w-full max-w-6xl mx-auto glass-panel rounded-xl overflow-hidden shadow-2xl relative animate-fade-in">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-patisserie-gold to-transparent opacity-50"></div>
            
            <div className="grid lg:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative h-96 lg:h-auto min-h-[500px] overflow-hidden group">
                     {data.imageUrl ? (
                        <div 
                            className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: `url(${data.imageUrl})` }}
                        />
                    ) : (
                        <div className="w-full h-full bg-patisserie-charcoal flex items-center justify-center">
                            <span className="text-patisserie-gold animate-pulse font-display">盛り付け中...</span>
                        </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                        <h2 className="text-4xl md:text-5xl font-display text-white mb-2 drop-shadow-lg">
                            {data.recipe.name}
                        </h2>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="p-8 lg:p-12 overflow-y-auto max-h-[800px] scrollbar-hide bg-patisserie-dark/95">
                    <RecipeCard recipe={data.recipe} />
                </div>
            </div>
        </div>
    );
};