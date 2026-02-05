"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/frontend/api-client";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Loader2,
    Package,
    Shield,
    Truck,
    CheckCircle2,
    Star,
    MapPin,
    Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await apiClient<{ data: Product }>(
                    `/api/v1/products/${slug}`
                );
                if (data?.data) {
                    setProduct(data.data);
                } else {
                    toast.error("Product not found");
                    router.push("/collection/products");
                }
            } catch (error) {
                toast.error("Failed to load product");
                router.push("/collection/products");
            }
            setLoading(false);
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug, router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const discountPercentage =
        product.discountPrice && product.discountPrice < product.price
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0;

    const finalPrice = product.discountPrice || product.price;

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        href="/collection/products"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Products
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Images (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Main Image */}
                        <div className="sticky top-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden border bg-card">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[selectedImage] || product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No Image Available
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {discountPercentage > 0 && (
                                    <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1.5 rounded-md font-bold text-sm">
                                        {discountPercentage}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-5 gap-2 mt-4">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? "border-primary ring-2 ring-primary/20"
                                                    : "border-transparent hover:border-muted-foreground"
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} - ${index + 1}`}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4">
                                <Button className="flex-1" size="lg">
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => toast.success("Added to wishlist!")}
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success("Link copied!");
                                    }}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Product Header */}
                        <div>
                            {product.brand && (
                                <Link href="#" className="text-sm text-primary hover:underline mb-2 block">
                                    {product.brand}
                                </Link>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                                {product.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-2">
                                        4.5 (2,347 ratings)
                                    </span>
                                </div>

                                <Badge
                                    variant={product.stock > 0 ? "default" : "destructive"}
                                    className="text-xs"
                                >
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : "Out of Stock"}
                                </Badge>

                                {typeof product.category === "object" && (
                                    <Badge variant="outline" className="text-xs">
                                        {product.category.name}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Pricing */}
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-baseline gap-3 mb-2">
                                <p className="text-3xl sm:text-4xl font-bold text-primary">
                                    ₹{finalPrice.toLocaleString()}
                                </p>
                                {discountPercentage > 0 && (
                                    <>
                                        <p className="text-xl text-muted-foreground line-through">
                                            ₹{product.price.toLocaleString()}
                                        </p>
                                        <span className="text-sm font-semibold text-green-600">
                                            Save ₹{(product.price - finalPrice).toLocaleString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                        </div>

                        {/* Highlights */}
                        {product.highlights && product.highlights.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                                <ul className="space-y-2">
                                    {product.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Warranty */}
                            {product.warranty && (
                                <Card>
                                    <CardHeader className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <CardTitle className="text-sm">
                                                    {product.warranty.duration || "Warranty"}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    {product.warranty.type || "Manufacturer Warranty"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )}

                            {/* Return Policy */}
                            {product.returnPolicy && product.returnPolicy.returnable && (
                                <Card>
                                    <CardHeader className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Package className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <CardTitle className="text-sm">
                                                    {product.returnPolicy.duration || "7 Days"} Return
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Easy Return Policy
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )}

                            {/* Shipping */}
                            {product.shippingInfo && (
                                <Card>
                                    <CardHeader className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Truck className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <CardTitle className="text-sm">
                                                    {product.shippingInfo.freeShipping ? "Free Shipping" : "Shipping"}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    {product.shippingInfo.estimatedDelivery || "3-5 Days"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>

                        <Separator />

                        {/* Tabs for Details */}
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="specifications">Specs</TabsTrigger>
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="info">More Info</TabsTrigger>
                            </TabsList>

                            {/* Description Tab */}
                            <TabsContent value="description" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {product.description || "No description available."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Specifications Tab */}
                            <TabsContent value="specifications" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Technical Specifications</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {product.specs && Object.keys(product.specs).length > 0 ? (
                                            <div className="space-y-3">
                                                {Object.entries(product.specs).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                                    >
                                                        <span className="font-medium text-sm">{key}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">
                                                No specifications available.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Features Tab */}
                            <TabsContent value="features" className="space-y-4">
                                {product.features && product.features.length > 0 ? (
                                    product.features.map((feature, index) => (
                                        <Card key={index}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card>
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground text-sm text-center">
                                                No detailed features available.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* More Info Tab */}
                            <TabsContent value="info" className="space-y-4">
                                {/* Warranty Details */}
                                {product.warranty?.details && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Warranty Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {product.warranty.details}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Return Policy Details */}
                                {product.returnPolicy?.details && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Return & Replacement Policy</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {product.returnPolicy.details}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Shipping Details */}
                                {product.shippingInfo?.details && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Shipping Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {product.shippingInfo.details}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Manufacturer Details */}
                                {product.manufacturerDetails && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Manufacturer Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {product.manufacturerDetails.name && (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{product.manufacturerDetails.name}</span>
                                                </div>
                                            )}
                                            {product.manufacturerDetails.country && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{product.manufacturerDetails.country}</span>
                                                </div>
                                            )}
                                            {product.manufacturerDetails.address && (
                                                <p className="text-sm text-muted-foreground pl-6">
                                                    {product.manufacturerDetails.address}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
