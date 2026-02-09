
"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function CartPage() {
    const { cart, loading, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary" />
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                <ShoppingCart className="h-20 w-20 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven&apos;t added any items yet.</p>
                <Link href="/collection">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((cartItem) => (
                        <div key={cartItem._id} className="flex flex-col sm:flex-row items-center p-4 gap-4 border rounded-md shadow-sm bg-card">
                            {/* Product Image */}
                            <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-md border">
                                {cartItem.product.images?.[0] ? (
                                    <Image
                                        src={cartItem.product.images[0]}
                                        alt={cartItem.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 space-y-1 text-center sm:text-left">
                                <Link href={`/collection/${cartItem.product.slug}`} className="hover:underline">
                                    <h3 className="font-semibold text-lg">{cartItem.product.name}</h3>
                                </Link>
                                <div className="text-sm">
                                    {cartItem.product.stock > 0 ? (
                                        <span className="text-green-600 font-medium">In Stock</span>
                                    ) : (
                                        <span className="text-destructive font-medium">Out of Stock</span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Unit Price: ₹{(cartItem.product.discountPrice || cartItem.product.price).toLocaleString('en-IN')}
                                </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={cartItem.quantity <= 1}
                                        onClick={() => updateQuantity(cartItem.product._id, cartItem.quantity - 1)}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={cartItem.quantity >= cartItem.product.stock}
                                        onClick={() => updateQuantity(cartItem.product._id, cartItem.quantity + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            {/* Price & Remove */}
                            <div className="flex flex-col items-center sm:items-end gap-2 min-w-[100px]">
                                <div className="font-bold text-lg">
                                    ₹{((cartItem.product.discountPrice || cartItem.product.price) * cartItem.quantity).toLocaleString('en-IN')}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                                    onClick={() => removeFromCart(cartItem.product._id)}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            {/* Tax Calculation Placeholder */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (Estimate)</span>
                                <span className="font-medium">₹{(subtotal * 0.18).toLocaleString('en-IN')}</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{(subtotal * 1.18).toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
