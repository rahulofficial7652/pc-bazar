export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number;
    category: Category | string;
    specs: Record<string, string>;
    description?: string;
    brand?: string;
    images?: string[];
    isActive: boolean;
    createdAt: string;
}
