
"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
                <p className="text-muted-foreground">Browse products and add your favorites here!</p>
                <Link href="/collection">
                    <Button>Browse Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <Card key={product._id} className="overflow-hidden group">
                        <CardContent className="p-4 space-y-4">
                            {/* Image */}
                            <div className="relative aspect-square bg-muted rounded-md overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground bg-muted">
                                        No Image
                                    </div>
                                )}

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-destructive hover:text-white rounded-full transition-colors shadow-sm"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Details */}
                            <div className="space-y-1">
                                <Link href={`/collection/${product.slug}`} className="hover:underline">
                                    <h3 className="font-semibold line-clamp-1 text-lg">{product.name}</h3>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">
                                        ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                                    </span>
                                    {product.discountPrice && (
                                        <span className="text-sm text-muted-foreground line-through">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                </div>
                                {product.stock > 0 ? (
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
                                ) : (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                )}
                            </div>

                            {/* Action */}
                            <Button
                                className="w-full"
                                disabled={product.stock <= 0}
                                onClick={() => addToCart(product._id)}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
