"use client";

import React, { useState } from 'react';
import GiftForm from './components/GiftForm';
import GiftResult from './components/GiftResult';
import { UserPreferences, GiftItem } from './types';
import { MOCK_GIFTS } from './data/mockGifts';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<GiftItem[]>([]);

  const handleFormSubmit = async (userPrefs: UserPreferences) => {
    setPrefs(userPrefs);
    setStep('loading');

    try {
      // Call AI API
      const res = await fetch('/api/gift-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPrefs),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error Details:", errorData);
        throw new Error(errorData.error || `API Error: ${res.status}`);
      }

      const data = await res.json();
      setRecommendations(data);
      setStep('result');
    } catch (e) {
      console.error("Failed to get recommendations", e);
      // Fallback to mock if API fails? Or just alert.
      // For now, let's keep the mock fallback for robustness during demo if key is invalid
      console.log("Falling back to mock data...");

      // ... original mock logic snippet or just simple fallback
      const filtered = MOCK_GIFTS.slice(0, 3);
      setRecommendations(filtered);
      setStep('result');
    }
  };

  const handleRestart = () => {
    setStep('form');
    setPrefs(null);
    setRecommendations([]);
  };

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/bg_home.png')" }}
          >
            {/* Soft overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full max-w-lg">
              <GiftForm onSubmit={handleFormSubmit} />
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center bg-black text-white"
          >
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-8" />
            <h2 className="text-2xl font-light tracking-widest animate-pulse">AI ANALYZING...</h2>
            <p className="text-gray-500 mt-2 text-sm">予算 {prefs?.budget.toLocaleString()}円 のベストチョイスを選定中</p>
          </motion.div>
        )}

        {step === 'result' && prefs && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GiftResult
              gifts={recommendations}
              prefs={prefs}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
