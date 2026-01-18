"use client";

import React, { useState } from 'react';
import { UserPreferences } from '@/app/types';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';

interface GiftFormProps {
    onSubmit: (prefs: UserPreferences) => void;
}

export default function GiftForm({ onSubmit }: GiftFormProps) {
    const [prefs, setPrefs] = useState<UserPreferences>({
        recipientGender: 'female',
        recipientAge: '20s',
        relation: '',
        budget: 5000,
        vibe: [],
        situation: 'birthday',
        isBulkOrder: false,
        itemCount: 3,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(prefs);
    };

    const situations = [
        { id: 'birthday', label: '誕生日' },
        { id: 'anniversary', label: '記念日' },
        { id: 'christmas', label: 'クリスマス' },
        { id: 'valentine', label: 'バレンタイン' },
        { id: 'wedding', label: '結婚祝い' },
        { id: 'birth', label: '出産祝い' },
        { id: 'farewell', label: '送別・異動' },
        { id: 'respect', label: '敬老の日' },
        { id: 'other', label: 'その他' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md border border-white/50 p-8 rounded-3xl shadow-2xl text-gray-800"
        >
            <div className="flex items-center justify-center gap-2 mb-8">
                <Sparkles className="text-purple-600" />
                <h2 className="text-2xl font-bold text-center text-gray-900">Gift Concierge</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Gender & Age Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">性別</label>
                        <select
                            value={prefs.recipientGender}
                            onChange={(e) => setPrefs({ ...prefs, recipientGender: e.target.value as any })}
                            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="female">女性</option>
                            <option value="male">男性</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">年代</label>
                        <select
                            value={prefs.recipientAge}
                            onChange={(e) => setPrefs({ ...prefs, recipientAge: e.target.value as any })}
                            className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {['10s', '20s', '30s', '40s', '50s', '60s+'].map(age => (
                                <option key={age} value={age}>{age}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Situation */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">シチュエーション</label>
                    <select
                        value={prefs.situation}
                        onChange={(e) => setPrefs({ ...prefs, situation: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {situations.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Bulk Order Toggle */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <input
                        type="checkbox"
                        id="bulk"
                        checked={prefs.isBulkOrder}
                        onChange={(e) => setPrefs({ ...prefs, isBulkOrder: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="bulk" className="text-sm font-medium text-purple-900 cursor-pointer select-none">
                        大量注文 (異動・結婚式のプチギフト等)
                    </label>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-600">予算 (1人あたり)</label>
                    <div className="grid grid-cols-4 gap-2">
                        {[300, 500, 1000, 3000, 5000, 10000, 30000, 50000].map((amount) => (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => setPrefs({ ...prefs, budget: amount })}
                                className={`py-2 px-1 rounded-lg text-sm transition-all border ${prefs.budget === amount
                                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                    }`}
                            >
                                ¥{amount.toLocaleString()}
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setPrefs({ ...prefs, budget: 100000 })}
                            className={`py-2 px-1 rounded-lg text-sm transition-all border ${prefs.budget >= 100000
                                ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                        >
                            10万+
                        </button>
                    </div>

                    <div className="mt-2">
                        <label className="text-xs text-gray-500 mb-1 block">または金額を指定 (円)</label>
                        <input
                            type="number"
                            min="0"
                            value={prefs.budget}
                            onChange={(e) => setPrefs({ ...prefs, budget: Math.max(0, Number(e.target.value)) })}
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <p className="text-xs text-right text-gray-400">※予算の前後20%の商品を検索します</p>
                </div>

                {/* Item Count Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-600">提案数</label>
                    <div className="flex gap-4">
                        {[3, 5, 10].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => setPrefs({ ...prefs, itemCount: count })}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${prefs.itemCount === count
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                {count}選
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!prefs.budget}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    AIに聞く
                </button>
            </form>
        </motion.div>
    );
}

