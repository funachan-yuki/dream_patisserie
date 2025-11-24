import React, { useState, useEffect } from 'react';

interface InputSectionProps {
    onGenerate: (keywords: string, cost: string, price: string) => void;
    onReset: () => void;
    isLoading: boolean;
    isRefining: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, onReset, isLoading, isRefining }) => {
    const [keywords, setKeywords] = useState('');
    const [cost, setCost] = useState('');
    const [price, setPrice] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (!isRefining) {
            setKeywords('');
        }
    }, [isRefining]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keywords.trim() && !isLoading) {
            onGenerate(keywords, cost, price);
            if (isRefining) setKeywords('');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-16 relative z-20">
            <div className={`transition-all duration-700 transform ${isLoading ? 'opacity-50 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                
                <div className="text-center mb-6">
                    <p className="font-display text-patisserie-gold/60 tracking-[0.3em] text-xs uppercase mb-2">
                        {isRefining ? "Refinement" : "New Creation"}
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl text-patisserie-cream italic">
                        {isRefining ? "さらに完璧な一皿へ" : "どのようなスイーツをお望みですか？"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <div className="glass-panel rounded-none md:rounded-full p-2 md:pl-8 flex flex-col md:flex-row items-center gap-2 shadow-2xl ring-1 ring-white/5 transition-all focus-within:ring-patisserie-gold/50 focus-within:shadow-patisserie-gold/10">
                        
                        {/* Main Input */}
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder={isRefining ? "例：季節のフルーツを加えて、もっと華やかに" : "例：雨上がりの紫陽花、初恋の甘酸っぱさ、和紅茶と柚子"}
                            className="w-full bg-transparent text-patisserie-cream placeholder-patisserie-cream/30 text-lg font-serif focus:outline-none py-4 text-center md:text-left"
                            disabled={isLoading}
                        />

                        {/* Action Group */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                            {/* Toggle Advanced */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`p-3 rounded-full transition-all duration-300 border border-white/10 ${showAdvanced ? 'bg-patisserie-gold/20 text-patisserie-gold' : 'text-patisserie-cream/40 hover:text-patisserie-gold hover:bg-white/5'}`}
                                title="価格設定"
                            >
                                <span className="font-display text-xs">¥</span>
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !keywords.trim()}
                                className="relative overflow-hidden bg-gradient-to-r from-patisserie-gold to-[#B8860B] text-patisserie-dark font-display font-bold tracking-widest px-8 py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                            >
                                <span className="relative z-10">{isRefining ? 'ARRANGE' : 'ORDER'}</span>
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"></div>
                            </button>
                        </div>
                    </div>

                    {/* Advanced Options (Price) Dropdown */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                        <div className="glass-panel rounded-xl p-6 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mx-4">
                            <div className="flex flex-col items-center gap-1">
                                <label className="font-display text-[10px] tracking-widest text-patisserie-gold uppercase">Target Cost</label>
                                <div className="flex items-baseline border-b border-patisserie-gold/30 focus-within:border-patisserie-gold transition-colors">
                                    <span className="text-patisserie-cream/40 text-sm mr-1">¥</span>
                                    <input 
                                        type="text" 
                                        value={cost}
                                        onChange={(e) => setCost(e.target.value)}
                                        placeholder="原価目安"
                                        className="bg-transparent text-patisserie-cream text-center w-24 focus:outline-none font-display"
                                    />
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                            <div className="flex flex-col items-center gap-1">
                                <label className="font-display text-[10px] tracking-widest text-patisserie-gold uppercase">Target Price</label>
                                <div className="flex items-baseline border-b border-patisserie-gold/30 focus-within:border-patisserie-gold transition-colors">
                                    <span className="text-patisserie-cream/40 text-sm mr-1">¥</span>
                                    <input 
                                        type="text" 
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="売値目安"
                                        className="bg-transparent text-patisserie-cream text-center w-24 focus:outline-none font-display"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reset / New Order Button */}
                    {isRefining && (
                        <div className="flex justify-center mt-10 animate-fade-in">
                            <button 
                                type="button"
                                onClick={onReset}
                                className="group relative flex items-center gap-4 px-8 py-3 rounded-full border border-patisserie-cream/20 hover:border-patisserie-gold/60 bg-white/5 hover:bg-patisserie-gold/10 transition-all duration-500 backdrop-blur-sm"
                            >
                                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-patisserie-gold/50 text-patisserie-gold group-hover:rotate-90 transition-transform duration-500 group-hover:bg-patisserie-gold group-hover:text-patisserie-dark">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-display text-xs text-patisserie-gold tracking-[0.15em] uppercase group-hover:text-patisserie-gold-light">New Order</span>
                                    <span className="font-serif text-xs text-patisserie-cream/60 group-hover:text-patisserie-cream/90">最初から作り直す（リセット）</span>
                                </div>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};