# Gift Concierge Implementation Plan: Phase 3 (Media Integration)

## Objective
Enhance gift suggestions with rich media (YouTube videos) to provide a better "Concierge" experience.

## Steps

1.  **YouTube Integration Strategy**
    - The goal is to show a review or promotional video for each suggested product.
    - **Option A (Ideal)**: Use YouTube Data API to search for `"{Product Name} review"` and get the top video ID.
        - Requires `YOUTUBE_API_KEY`.
    - **Option B (No Key)**: Generating a "Search on YouTube" link button instead of embedding.
    - **Option C (AI Guessing)**: Ask Gemini to guess a YouTube ID (Very unreliable, not recommended).

2.  **Implementation (Assuming Option A)**
    - [ ] Update `.env.local` with `YOUTUBE_API_KEY`.
    - [ ] Create `app/lib/youtube.ts` to handle search queries.
    - [ ] Update `app/api/gift-recommend/route.ts`:
        - After getting AI results, run parallel YouTube searches for each item name.
        - Append `youtubeId` to the response.

3.  **Frontend Polish**
    - [ ] Verify the video modal works with real IDs.
    - [ ] (If Option B) Replace the Play button with a "Watch Video" link button if no ID is found.

## Status Checklist
- [x] Phase 1: UI/UX
- [x] Phase 2: AI Logic (Gemini)
- [x] Phase 3: YouTube Integration (Shorts & Strict Filtering)
- [ ] Phase 4: Product Images (Google Custom Search API)

# Phase 4: Visuals & Polish
1.  **Real Product Images**
    - Current: Using `placehold.co` placeholders.
    - Goal: Fetch real product images.
    - Solution: Google Custom Search API (Image Search).
    - Requirement: Enable "Custom Search API" in Google Cloud Console & Create a Programmable Search Engine.
    - **Status**: Implementation complete. Awaiting API quota reset to test.

2.  **UI/UX Improvements**
    - Better Loading State (Skeleton screens).
    - Error handling for API limits.

## Current Blocker (2026-01-18)
- **Gemini API Quota Exhausted**: 429 Too Many Requests (limit: 0)
- **Scheduled Retry**: 17:00 JST (quota resets at PST 00:00 = JST 17:00)
- **New API Key**: `AIzaSyB8kCT4DRH0PIlnkXsc67fxsZ-Q0YdnfAY` (from new project)

