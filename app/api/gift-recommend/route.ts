import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/app/lib/gemini';
import { UserPreferences, GiftItem } from '@/app/types';
import { searchYouTubeVideos } from '@/app/lib/youtube';
import { searchGoogleImages } from '@/app/lib/google-search';

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Server: GEMINI_API_KEY is missing");
    return NextResponse.json({ error: 'Config Error: GEMINI_API_KEY is not set in .env.local' }, { status: 500 });
  }

  try {
    const prefs: UserPreferences = await req.json();

    // output log to server console
    console.log("Server: Processing request for", prefs.situation, prefs.budget);

    const prompt = `
      Suggest exactly ${prefs.itemCount || 3} gift ideas.
      Requirements:
      - Recipient: ${prefs.recipientGender}, ${prefs.recipientAge}
      - Relation: ${prefs.relation || 'Unknown'}
      - Situation: ${prefs.situation}
      - Budget: ${prefs.budget} JPY (+/- 20%)
      - Bulk: ${prefs.isBulkOrder ? 'YES' : 'NO'}
      - Vibe: ${prefs.vibe.join(', ') || 'Any'}

      IMPORTANT:
      - Do NOT suggest generic categories.
      - You MUST suggest SPECIFIC Real-world Products with Brand Names.
      - Product Name MUST be in Japanese (Katakana/Kanji) if possible.
      - Prices must be realistic market estimates.
      - STRICTLY RESPECT THE BUDGET. Do NOT suggest items below ${Math.round(prefs.budget * 0.8)} JPY.
      - Do NOT suggest items above ${Math.round(prefs.budget * 1.2)} JPY.

      Output Format: JSON Array.
      [
        {
          "name": "Brand Name - Product Name (in Japanese)",
          "price": 5000,
          "description": "Short description (max 80 chars).",
          "reason": "Short reason (max 80 chars).",
          "category": "Category"
        }
      ]
      Language: Japanese.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const items: any[] = JSON.parse(text);

    // Filter items to strictly enforce budget constraints (+/- 20%)
    const minBudget = prefs.budget * 0.8;
    const maxBudget = prefs.budget * 1.2;

    const validItems = items.filter(item => {
      // Allow higher budget items if budget is very high (>= 30000) to avoid too empty results,
      // but for standard budgets, be strict.
      if (prefs.budget >= 30000) return item.price >= minBudget;
      return item.price >= minBudget && item.price <= maxBudget;
    });

    // Post-process to conform to GiftItem type
    // If filtering removed too many, we use the original list but maybe flag them? 
    // For now, let's return valid items only. If none, return original (AI failed constraint) but warn.
    const finalItems = validItems.length > 0 ? validItems : items;

    const giftItems: GiftItem[] = finalItems.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      name: item.name,
      price: item.price,
      description: item.description,
      reason: item.reason,
      // ...
      imageUrl: 'https://placehold.co/600x400?text=Gift',
      affiliateUrl: '', // Not used anymore
      category: item.category,
      youtubeIds: undefined,
    }));

    // Parallel Fetching: YouTube Videos AND Google Images
    const itemsWithMedia = await Promise.all(giftItems.map(async (item) => {
      try {
        // Run both searches concurrently for speed
        const [videoIds, imageUrl] = await Promise.all([
          searchYouTubeVideos(item.name),
          searchGoogleImages(item.name + " 商品画像") // Append "Product Image" in Japanese for better results
        ]);

        return {
          ...item,
          youtubeIds: videoIds.length > 0 ? videoIds : undefined,
          imageUrl: imageUrl || 'https://placehold.co/600x400?text=No+Image'
        };
      } catch (e) {
        console.error(`Failed to fetch media for ${item.name}`, e);
        return item;
      }
    }));

    return NextResponse.json(itemsWithMedia);

  } catch (error: any) {
    console.error("AI Error Detailed:", error?.message);
    // Return actual error message to client for debugging
    return NextResponse.json({
      error: error?.message || 'Failed to generate recommendations',
      details: error?.stack
    }, { status: 500 });
  }
}
