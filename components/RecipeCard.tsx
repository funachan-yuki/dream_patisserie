import React, { useEffect, useState } from 'react';
import { SweetRecipe, RecipeStep } from '../types';
import { generateStepIllustration } from '../services/geminiService';

interface RecipeCardProps {
    recipe: SweetRecipe;
}

const StepItem: React.FC<{ step: RecipeStep; index: number }> = ({ step, index }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchImage = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, index * 1200)); // Stagger loading
                const url = await generateStepIllustration(step.visualDescription);
                if (isMounted && url) {
                    setImageUrl(url);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchImage();
        return () => { isMounted = false; };
    }, [step.visualDescription, index]);

    return (
        <div className="relative pl-12 pb-12 last:pb-0 group">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-8 bottom-0 w-[1px] bg-gradient-to-b from-patisserie-gold/50 to-transparent group-last:hidden"></div>
            
            {/* Number Marker */}
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full border border-patisserie-gold flex items-center justify-center bg-patisserie-dark z-10 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <span className="font-display text-[10px] text-patisserie-gold">{index + 1}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Text Content */}
                <div className="flex-1 pt-1">
                    <p className="font-serif text-patisserie-cream/90 leading-loose tracking-wide text-sm md:text-base">
                        {step.instruction}
                    </p>
                </div>

                {/* Sketch Card - Looks like paper */}
                <div className="w-full md:w-48 shrink-0">
                    <div className="relative aspect-[4/3] bg-paper rounded-sm shadow-lg rotate-1 group-hover:rotate-0 transition-transform duration-500 p-2 overflow-hidden">
                        <div className="absolute inset-0 border border-black/5 m-1 pointer-events-none"></div>
                        
                        {/* Loading/Image Area */}
                        <div className="w-full h-full flex items-center justify-center relative">
                            {imageUrl ? (
                                <img 
                                    src={imageUrl} 
                                    alt="Chef's sketch" 
                                    className="w-full h-full object-contain mix-blend-multiply filter sepia-[0.2] contrast-125 animate-fade-in"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    {loading ? (
                                        <div className="w-4 h-4 border border-black/20 border-t-black/60 rounded-full animate-spin mb-2"></div>
                                    ) : (
                                        <span className="font-script text-2xl text-black/20">Sketch</span>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Tape effect */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-white/20 backdrop-blur-[1px] shadow-sm transform -rotate-2 opacity-60"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    return (
        <div className="space-y-12 animate-fade-in-up">
            
            {/* Concept Header */}
            <div className="text-center space-y-6 pb-8 border-b border-patisserie-gold/10">
                <div className="inline-block border-y border-patisserie-gold/30 py-2 px-6">
                     <p className="font-display text-patisserie-gold text-sm tracking-[0.2em] uppercase">Concept & Story</p>
                </div>
                <p className="font-serif text-xl md:text-2xl text-patisserie-cream/90 italic leading-relaxed max-w-2xl mx-auto">
                    "{recipe.description}"
                </p>
                <div className="flex justify-center gap-2">
                    {recipe.flavorProfile.split('、').map((flavor, i) => (
                         <span key={i} className="text-xs font-sans text-patisserie-gold/60 border border-patisserie-gold/20 px-3 py-1 rounded-full bg-patisserie-gold/5">
                             {flavor.trim()}
                         </span>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-12 gap-12">
                
                {/* Left Column: Ingredients & Price (Menu Style) */}
                <div className="md:col-span-4 space-y-10">
                    
                    {/* Ingredients */}
                    <div className="bg-white/[0.02] p-8 border border-white/5 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-patisserie-dark px-4">
                            <h4 className="font-display text-patisserie-gold tracking-widest text-sm">INGREDIENTS</h4>
                        </div>
                        <ul className="space-y-4">
                            {recipe.ingredients.map((item, idx) => (
                                <li key={idx} className="font-sans text-sm text-patisserie-cream/70 border-b border-dashed border-white/10 pb-2 flex justify-between items-end">
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Economics */}
                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center group cursor-default">
                            <span className="font-display text-xs text-patisserie-cream/40 tracking-widest uppercase group-hover:text-patisserie-gold transition-colors">Cost Price</span>
                            <span className="font-display text-lg text-patisserie-cream/60">{recipe.costPrice}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-default">
                            <span className="font-display text-xs text-patisserie-gold tracking-widest uppercase">Selling Price</span>
                            <span className="font-display text-2xl text-patisserie-gold border-b-2 border-patisserie-gold/50 pb-1">{recipe.sellingPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Steps */}
                <div className="md:col-span-8">
                    <div className="mb-8 flex items-center gap-4">
                        <h4 className="font-display text-2xl text-white tracking-widest">RECIPE STEPS</h4>
                        <div className="h-px bg-gradient-to-r from-patisserie-gold/50 to-transparent flex-1"></div>
                    </div>
                    <div className="space-y-2">
                        {recipe.steps.map((step, idx) => (
                            <StepItem key={idx} step={step} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};