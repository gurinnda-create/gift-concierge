import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    const debugInfo: any = {
        apiKeyExists: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET',
        cxExists: !!cx,
        cxValue: cx || 'NOT SET',
    };

    if (!apiKey || !cx) {
        return NextResponse.json({
            error: 'Missing API key or Search Engine ID',
            debug: debugInfo
        });
    }

    try {
        const testQuery = 'アンカー モバイルバッテリー site:amazon.co.jp';
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(testQuery)}&cx=${cx}&searchType=image&key=${apiKey}&num=1&safe=active`;

        debugInfo.searchUrl = url.replace(apiKey, 'API_KEY_HIDDEN');

        const response = await fetch(url);
        const data = await response.json();

        debugInfo.responseStatus = response.status;
        debugInfo.responseOk = response.ok;

        if (data.error) {
            return NextResponse.json({
                error: 'Google API Error',
                googleError: data.error,
                debug: debugInfo
            });
        }

        if (data.items && data.items.length > 0) {
            return NextResponse.json({
                success: true,
                imageUrl: data.items[0].link,
                title: data.items[0].title,
                debug: debugInfo
            });
        }

        return NextResponse.json({
            error: 'No results found',
            rawResponse: data,
            debug: debugInfo
        });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Fetch error',
            message: error.message,
            debug: debugInfo
        });
    }
}
