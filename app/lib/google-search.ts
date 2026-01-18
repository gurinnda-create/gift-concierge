
interface GoogleImageResult {
    link: string;
    title: string;
    image: {
        thumbnailLink: string;
    }
}

export async function searchGoogleImages(query: string): Promise<string | null> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
        console.warn('Google API Key or Search Engine ID is missing');
        return null;
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        // Simple search - Amazon only for best product images
        const searchQuery = `${query} site:amazon.co.jp`;
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(searchQuery)}&cx=${cx}&searchType=image&key=${apiKey}&num=1&safe=active`;

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].link;
        }
        return null;

    } catch (error) {
        // Timeout or error - return null quickly
        return null;
    }
}
