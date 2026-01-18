export async function searchYouTubeVideos(query: string): Promise<string[]> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn('YOUTUBE_API_KEY is not set');
        return [];
    }

    try {
        // Fetch candidates (reduced from 10 to 5 for speed)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&videoDuration=short&key=${apiKey}`;

        const response = await fetch(searchUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Strict-ish Filtering Logic: Relaxed to ~70% match
            const searchTokens = query.toLowerCase()
                .replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, ' ')
                .split(/\s+/)
                .filter(token => token.length > 1);

            const filteredItems = data.items.filter((item: any) => {
                const title = (item.snippet.title || '').toLowerCase();
                const channelTitle = (item.snippet.channelTitle || '').toLowerCase();
                const combinedText = `${title} ${channelTitle}`;

                if (searchTokens.length === 0) return true;

                const matchCount = searchTokens.reduce((count, token) => {
                    return count + (combinedText.includes(token) ? 1 : 0);
                }, 0);

                // If only 1 or 2 tokens, require 100%. If more, require ~66%.
                // e.g. 3 tokens -> need 2. 4 tokens -> need 3.
                const threshold = searchTokens.length <= 2 ? searchTokens.length : Math.ceil(searchTokens.length * 0.66);

                return matchCount >= threshold;
            });

            return filteredItems.slice(0, 3).map((item: any) => item.id.videoId);
        }
        return [];
    } catch (error) {
        console.error('YouTube API Error:', error);
        return [];
    }
}
