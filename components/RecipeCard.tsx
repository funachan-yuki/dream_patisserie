import React from 'react';
import { SweetRecipe } from '../types';

interface RecipeCardProps {
    recipe: SweetRecipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Info */}
            <div className="border-b border-patisserie-gold/20 pb-6">
                <h3 className="font-display text-2xl text-patisserie-gold mb-2">作品コンセプト</h3>
                <p className="font-serif text-lg italic text-patisserie-cream/90 leading-relaxed">
                    "{recipe.description}"
                </p>
                <div className="mt-4 inline-block px-4 py-1 border border-patisserie-gold/40 rounded-full text-xs font-sans tracking-widest text-patisserie-gold uppercase">
                    {recipe.flavorProfile}
                </div>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-lg text-center">
                    <p className="text-xs uppercase tracking-widest text-patisserie-cream/60 mb-1">推定原価</p>
                    <p className="font-display text-xl text-white">{recipe.costPrice}</p>
                </div>
                <div className="glass-panel p-4 rounded-lg text-center border-patisserie-gold">
                    <p className="text-xs uppercase tracking-widest text-patisserie-gold mb-1">推奨価格</p>
                    <p className="font-display text-xl text-patisserie-gold">{recipe.sellingPrice}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                    <h4 className="font-display text-lg text-patisserie-gold mb-4 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-patisserie-gold"></span> 材料
                    </h4>
                    <ul className="space-y-2 font-sans text-sm text-patisserie-cream/80">
                        {recipe.ingredients.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 border-b border-white/5 pb-2">
                                <span className="text-patisserie-gold">•</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div>
                    <h4 className="font-display text-lg text-patisserie-gold mb-4 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-patisserie-gold"></span> 作り方
                    </h4>
                    <ol className="space-y-4 font-sans text-sm text-patisserie-cream/80">
                        {recipe.steps.map((step, idx) => (
                            <li key={idx} className="relative pl-6">
                                <span className="absolute left-0 top-0 font-display text-patisserie-gold/50 text-xs font-bold">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};