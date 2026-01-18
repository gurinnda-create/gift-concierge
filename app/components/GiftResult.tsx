"use client";

import React, { useState } from 'react';
import { GiftItem, UserPreferences } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, X, Gift } from 'lucide-react';
import clsx from 'clsx';

interface GiftResultProps {
    gifts: GiftItem[];
    prefs: UserPreferences;
    onRestart: () => void;
}

export default function GiftResult({ gifts, prefs, onRestart }: GiftResultProps) {
    const [selectedVideoData, setSelectedVideoData] = useState<{ ids: string[]; index: number } | null>(null);

    // Determine theme based on budget
    // Determine theme based on budget and bulk order status
    const getTheme = () => {
        if (prefs.isBulkOrder || prefs.budget < 1000) return 'bulk';
        if (prefs.budget < 10000) return 'teen';
        if (prefs.budget >= 100000) return 'luxury';
        return 'standard';
    };

    const theme = getTheme();

    const containerStyles = clsx(
        "min-h-screen p-4 md:p-10 transition-colors duration-700 bg-cover bg-center bg-fixed bg-no-repeat",
        {
            'font-sans': theme === 'teen',
            'font-serif': theme === 'standard',
            'text-gold-100 font-serif': theme === 'luxury',
            'font-sans text-gray-700': theme === 'bulk', // Clean & Cute
        }
    );

    const cardStyles = clsx(
        "relative overflow-hidden group transition-all duration-300",
        {
            'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl': theme === 'teen',
            'bg-white shadow-xl hover:shadow-2xl rounded-xl border border-gray-100': theme === 'standard',
            'bg-zinc-900 border border-zinc-800 shadow-2xl hover:shadow-gold rounded-none': theme === 'luxury',
            'bg-white/80 backdrop-blur-sm border border-pink-100 shadow-sm hover:shadow-md rounded-2xl': theme === 'bulk',
        }
    );

    const textStyles = {
        title: clsx("text-2xl font-bold mb-2", {
            'text-black': theme === 'teen',
            'text-slate-800': theme === 'standard',
            'text-yellow-600': theme === 'luxury',
            'text-gray-800': theme === 'bulk',
        }),
        price: clsx("text-lg font-bold mb-4", {
            'text-pink-600': theme === 'teen',
            'text-slate-500': theme === 'standard',
            'text-zinc-400': theme === 'luxury',
            'text-pink-400': theme === 'bulk',
        }),
        desc: clsx("text-sm mb-4 leading-relaxed", {
            'text-gray-900': theme === 'teen',
            'text-gray-600': theme === 'standard' || theme === 'bulk',
            'text-gray-300': theme === 'luxury',
        }),
    };


    const bgImage = theme === 'teen' ? 'url("/bg_casual.png")'
        : theme === 'luxury' ? 'url("/bg_luxury.png")'
            : theme === 'bulk' ? 'url("/bg_bulk.png")'
                : 'url("/bg_gift.png")';

    const handleVideoClick = (ids: string[]) => {
        setSelectedVideoData({ ids, index: 0 });
    };

    const handleNextVideo = () => {
        if (selectedVideoData && selectedVideoData.index < selectedVideoData.ids.length - 1) {
            setSelectedVideoData({ ...selectedVideoData, index: selectedVideoData.index + 1 });
        }
    };

    const handlePrevVideo = () => {
        if (selectedVideoData && selectedVideoData.index > 0) {
            setSelectedVideoData({ ...selectedVideoData, index: selectedVideoData.index - 1 });
        }
    };

    return (
        <div className={containerStyles} style={{ backgroundImage: bgImage }} >
            {/* Overlay for readability */}
            < div className={
                clsx("absolute inset-0 z-0 pointer-events-none", {
                    'bg-white/30': theme === 'teen',
                    'bg-white/40': theme === 'standard',
                    'bg-black/20': theme === 'luxury',
                    'bg-white/60': theme === 'bulk',
                })} />

            {/* Background Ambience for Luxury */}
            {theme === 'luxury' && <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black z-0 pointer-events-none opacity-50" />}

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className={clsx("text-4xl md:text-5xl font-bold mb-4", {
                            'text-black italic tracking-tighter drop-shadow-sm': theme === 'teen',
                            'text-slate-900 tracking-tight': theme === 'standard',
                            'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 tracking-widest uppercase': theme === 'luxury',
                            'text-gray-700 font-medium tracking-wide': theme === 'bulk',
                        })}>
                            Best Selection
                        </h1>
                        <p className={clsx("text-lg", {
                            'text-black font-bold': theme === 'teen',
                            'text-slate-500': theme === 'standard',
                            'text-zinc-400 font-light': theme === 'luxury',
                            'text-gray-600': theme === 'bulk',
                        })}>
                            予算¥{prefs.budget.toLocaleString()}で選ぶ、{theme === 'luxury' ? '極上の3品' : '間違いのない3品'}
                        </p>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {gifts.map((gift, i) => (
                        <motion.div
                            key={gift.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className={cardStyles}
                        >
                            {/* Image Area */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={gift.imageUrl}
                                    alt={gift.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* YouTube Button Overlay */}
                                {gift.youtubeIds && gift.youtubeIds.length > 0 && (
                                    <button
                                        onClick={() => handleVideoClick(gift.youtubeIds!)}
                                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Play fill="white" className="ml-1" />
                                        </div>
                                        <div className="absolute bottom-4 text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-full">
                                            {gift.youtubeIds.length > 1 ? `動画 ${gift.youtubeIds.length}件` : '動画を見る'}
                                        </div>
                                    </button>
                                )}

                                {/* Rank Badge */}
                                <div className={clsx("absolute top-4 left-4 w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg z-10", {
                                    'bg-yellow-400 text-black rounded-full border-2 border-black': theme === 'teen',
                                    'bg-white text-slate-900 rounded-full': theme === 'standard',
                                    'bg-zinc-900 text-yellow-500 border border-yellow-600': theme === 'luxury',
                                })}>
                                    {i + 1}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6">
                                <h3 className={textStyles.title}>{gift.name}</h3>
                                <p className={textStyles.price}>¥{gift.price.toLocaleString()}</p>
                                <p className={textStyles.desc}>{gift.description}</p>

                                <div className={clsx("p-4 rounded-lg text-sm", {
                                    'bg-blue-100 text-blue-900 font-bold transform -rotate-1': theme === 'teen',
                                    'bg-slate-50 text-slate-700 border-l-4 border-slate-400': theme === 'standard',
                                    'bg-zinc-800 text-zinc-300 border-l-2 border-yellow-700 italic': theme === 'luxury',
                                    'bg-pink-50 text-pink-700 border border-pink-100 rounded-xl': theme === 'bulk',
                                })}>
                                    <p className="flex items-start gap-2">
                                        <Gift size={16} className="mt-1 shrink-0" />
                                        {gift.reason}
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <a
                                        href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(gift.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx("flex-1 min-w-[80px] py-2 text-center font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all", {
                                            'bg-yellow-400 text-black hover:bg-yellow-500 shadow-md': theme === 'teen',
                                            'bg-[#FF9900] text-white hover:opacity-90 shadow-md': theme === 'standard' || theme === 'bulk',
                                            'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white border border-yellow-500': theme === 'luxury',
                                        })}
                                    >
                                        <span>Amazon</span>
                                        <ExternalLink size={12} />
                                    </a>
                                    <a
                                        href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(gift.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx("flex-1 min-w-[80px] py-2 text-center font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all", {
                                            'bg-red-400 text-white hover:bg-red-500 shadow-md': theme === 'teen',
                                            'bg-[#BF0000] text-white hover:opacity-90 shadow-md': theme === 'standard' || theme === 'bulk',
                                            'bg-zinc-800 text-white border border-red-900': theme === 'luxury',
                                        })}
                                    >
                                        <span>楽天</span>
                                        <ExternalLink size={12} />
                                    </a>
                                    <a
                                        href={`https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(gift.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx("flex-1 min-w-[80px] py-2 text-center font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-all", {
                                            'bg-purple-400 text-white hover:bg-purple-500 shadow-md': theme === 'teen',
                                            'bg-[#FF0033] text-white hover:opacity-90 shadow-md': theme === 'standard' || theme === 'bulk',
                                            'bg-zinc-800 text-white border border-purple-900': theme === 'luxury',
                                        })}
                                    >
                                        <span>Yahoo!</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={onRestart}
                        className={clsx("px-8 py-3 rounded-full transition-colors", {
                            'bg-white text-black border-2 border-black font-bold hover:bg-black hover:text-white': theme === 'teen',
                            'text-slate-500 hover:text-slate-800 underline': theme === 'standard',
                            'text-zinc-500 hover:text-yellow-500 tracking-widest uppercase text-sm border border-transparent hover:border-yellow-900 px-8 py-3': theme === 'luxury',
                        })}
                    >
                        条件を変更して再検索
                    </button>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideoData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    >
                        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex items-center">

                            {/* Prev Button */}
                            {selectedVideoData.ids.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrevVideo(); }}
                                    disabled={selectedVideoData.index === 0}
                                    className="absolute left-4 z-20 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="text-2xl">←</span>
                                </button>
                            )}

                            {/* Main Video */}
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${selectedVideoData.ids[selectedVideoData.index]}?autoplay=1`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="border-none w-full h-full"
                            ></iframe>

                            {/* Next Button */}
                            {selectedVideoData.ids.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNextVideo(); }}
                                    disabled={selectedVideoData.index === selectedVideoData.ids.length - 1}
                                    className="absolute right-4 z-20 p-3 bg-white/10 hover:bg-white/30 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <span className="text-2xl">→</span>
                                </button>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideoData(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Pagination Indicator */}
                            {selectedVideoData.ids.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                                    {selectedVideoData.ids.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === selectedVideoData.index ? 'bg-white scale-125' : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
