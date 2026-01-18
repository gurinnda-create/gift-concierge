export type TargetAge = '10s' | '20s-30s' | '40s+' | 'wealthy';

export interface GiftItem {
    id: string;
    name: string;
    price: number;
    description: string;
    reason: string; // "Why this is recommended"
    imageUrl: string;
    youtubeIds?: string[]; // YouTube video IDs for the product
    affiliateUrl: string;
    category: string;
}

export interface UserPreferences {
    recipientGender: 'male' | 'female' | 'other';
    recipientAge: '10s' | '20s' | '30s' | '40s' | '50s' | '60s+';
    relation: string; // e.g., friend, partner, parent
    budget: number;
    vibe: string[]; // e.g., "stylish", "practical", "funny"
    situation: string;
    isBulkOrder: boolean;
    itemCount: number; // 3, 5, or 10
}
