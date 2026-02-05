export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: Category | string;
    specs: Record<string, string>;
    description?: string;
    brand?: string;
    images?: string[];

    // E-commerce Details
    highlights?: string[];
    features?: Array<{
        title: string;
        description: string;
    }>;

    // Services & Policies
    warranty?: {
        duration?: string;
        type?: string;
        details?: string;
    };
    returnPolicy?: {
        returnable?: boolean;
        duration?: string;
        details?: string;
    };
    shippingInfo?: {
        freeShipping?: boolean;
        minOrderForFreeShipping?: number;
        estimatedDelivery?: string;
        details?: string;
    };

    // Additional Info
    manufacturerDetails?: {
        name?: string;
        country?: string;
        address?: string;
    };

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];

    // Status
    isActive: boolean;
    isFeatured?: boolean;
    createdAt: string;
}
