import React, { useState } from 'react';

interface InputSectionProps {
    onGenerate: (keywords: string) => void;
    isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isLoading }) => {
    const [keywords, setKeywords] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keywords.trim() && !isLoading) {
            onGenerate(keywords);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-10">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="キーワードを入力（例：初恋の味、真夜中の森、柚子と山椒）"
                    className="w-full bg-patisserie-charcoal/80 text-patisserie-cream placeholder-patisserie-cream/40 border border-patisserie-gold/30 rounded-full py-4 px-8 pr-36 focus:outline-none focus:ring-2 focus:ring-patisserie-gold focus:border-transparent transition-all font-serif text-lg shadow-xl backdrop-blur-md"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !keywords.trim()}
                    className={`absolute right-2 top-2 bottom-2 bg-patisserie-gold text-patisserie-dark font-bold font-display rounded-full px-6 transition-all duration-300 hover:bg-white hover:text-patisserie-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLoading ? 'w-12 px-0' : ''}`}
                >
                    {isLoading ? (
                        <div className="loader ease-linear rounded-full border-2 border-t-2 border-patisserie-dark h-5 w-5"></div>
                    ) : (
                        <span>オーダー</span>
                    )}
                </button>
            </form>
            <p className="text-center text-patisserie-cream/50 mt-4 text-sm font-sans tracking-widest uppercase">
                あなたのイメージから、世界にひとつのスイーツを
            </p>
        </div>
    );
};