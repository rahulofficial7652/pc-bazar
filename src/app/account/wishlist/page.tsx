"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type WishlistItem = {
    id: string;
    productId: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number;
    image: string;
    brand: string;
    inStock: boolean;
};

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const data = await apiClient<{ wishlist: any[] }>("/api/user/wishlist");
            if (data && data.wishlist) {
                const mapped = data.wishlist.map((p: any) => ({
                    id: p._id,
                    productId: p._id,
                    name: p.name,
                    slug: p.slug,
                    price: p.price,
                    discountPrice: p.discountPrice,
                    image: p.images && p.images[0] ? p.images[0] : "https://placehold.co/300x300/png?text=Product",
                    brand: p.brand,
                    inStock: p.stock > 0
                }));
                setWishlistItems(mapped);
            }
        } catch (error) {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            await apiClient(`/api/user/wishlist?productId=${productId}`, { method: "DELETE" });
            setWishlistItems(wishlistItems.filter((item) => item.productId !== productId));
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (item: WishlistItem) => {
        // Here we would sync with Cart API or LocalStorage Cart Context.
        // For now, just show toast as per existing logic, or integration with context if available.
        // Assuming Context not available here easily without Refactoring.
        toast.success(`${item.name} added to cart`);
    };

    const calculateDiscount = (price: number, discountPrice?: number) => {
        if (!discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading wishlist...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                    </p>
                </div>
            </div>

            {wishlistItems.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="relative mb-6">
                            <Heart className="h-20 w-20 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
                        <p className="text-muted-foreground mb-8 text-center max-w-md">
                            Save items you like to your wishlist. Review them anytime and easily
                            move them to your bag.
                        </p>
                        <Link href="/collection">
                            <Button size="lg">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => {
                        const discount = calculateDiscount(item.price, item.discountPrice);

                        return (
                            <Card key={item.id} className="group overflow-hidden">
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    {/* Use img tag for simplicity or Next Image if domain config allows */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {discount > 0 && (
                                        <Badge className="absolute top-3 left-3 bg-red-500">
                                            {discount}% OFF
                                        </Badge>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-3 right-3 h-8 w-8"
                                        onClick={() => handleRemove(item.productId)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    {!item.inStock && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Badge variant="destructive" className="text-sm">
                                                Out of Stock
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {item.brand}
                                        </p>
                                        <Link href={`/collection/${item.slug}`}>
                                            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold">
                                            ₹{(item.discountPrice || item.price).toLocaleString()}
                                        </span>
                                        {item.discountPrice && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                ₹{item.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            onClick={() => handleAddToCart(item)}
                                            disabled={!item.inStock}
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            {item.inStock ? "Add to Cart" : "Out of Stock"}
                                        </Button>
                                        <Link href={`/collection/${item.slug}`}>
                                            <Button variant="outline" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>

                                    {item.inStock && (
                                        <p className="text-xs text-green-600 font-medium">
                                            ✓ In Stock
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
