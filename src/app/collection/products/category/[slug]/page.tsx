"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/frontend/api-client";
import { Category, Product } from "@/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/* ---------------------------
   Skeleton Card Component
---------------------------- */
function ProductSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col h-full animate-pulse">
            <div className="w-full aspect-[4/5] bg-muted" />
            <CardHeader className="p-4 pb-2">
                <div className="h-5 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
            </CardContent>
            <CardFooter className="p-4">
                <div className="h-10 bg-muted rounded w-full" />
            </CardFooter>
        </Card>
    );
}

/* ---------------------------
   Category Products Page
---------------------------- */
export default function CategoryProductsPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // First, fetch the category by slug
                const categoriesResponse = await apiClient<any>("/api/v1/categories");
                const categoriesData = categoriesResponse?.data || categoriesResponse;
                const foundCategory = categoriesData?.find((cat: Category) => cat.slug === slug);

                if (!foundCategory) {
                    router.push("/collection/products");
                    return;
                }

                setCategory(foundCategory);

                // Then fetch products for this category
                const params = new URLSearchParams({
                    category: foundCategory._id,
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString(),
                });

                const data = await apiClient<any>(`/api/v1/products?${params.toString()}`);

                if (data) {
                    setProducts(data.products || []);
                    if (data.pagination) {
                        setTotalPages(data.pagination.totalPages);
                        setTotalProducts(data.pagination.totalProducts);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
            setLoading(false);
        };

        if (slug) {
            fetchData();
        }
    }, [slug, currentPage, router]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!category) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link
                    href="/collection/products"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to All Products
                </Link>
            </div>

            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    {category.name}
                </h1>
                <p className="text-muted-foreground">
                    Browse our collection of {totalProducts} {category.name.toLowerCase()}
                </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {/* Skeleton Loader */}
                {loading &&
                    Array.from({ length: itemsPerPage }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}

                {/* Products */}
                {!loading &&
                    products.map((product) => (
                        <Link
                            key={product._id}
                            href={`/collection/products/${product.slug}`}
                        >
                            <Card className="group overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 cursor-pointer">
                                {/* Image */}
                                <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] md:aspect-[1/1] lg:aspect-[3/4] xl:aspect-[4/5] overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                                            No Image
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {product.discountPrice && product.discountPrice < product.price && (
                                        <div className="absolute top-2 right-2 bg-destructive text-white px-2 py-1 rounded-md text-xs font-bold">
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </div>
                                    )}

                                    {/* Stock Badge */}
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Header */}
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2">
                                        {product.name}
                                    </CardTitle>
                                    {product.brand && (
                                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                                    )}
                                </CardHeader>

                                {/* Content */}
                                <CardContent className="p-4 pt-0 flex-grow space-y-1">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-xl font-bold text-primary">
                                            ₹{product.discountPrice || product.price}
                                        </p>
                                        {product.discountPrice && product.discountPrice < product.price && (
                                            <p className="text-sm text-muted-foreground line-through">
                                                ₹{product.price}
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {product.description}
                                    </p>
                                </CardContent>

                                {/* Footer */}
                                <CardFooter className="p-4 mt-auto">
                                    <Button
                                        className="w-full h-9 text-sm gap-2 group-hover:scale-[1.02] transition-transform"
                                        disabled={product.stock === 0}
                                    >
                                        <ShoppingCart size={16} />
                                        {product.stock === 0 ? "Out of Stock" : "View Details"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
            </div>

            {/* Empty State */}
            {!loading && products.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">
                        No products found in this category.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="min-w-[40px]"
                                    >
                                        {page}
                                    </Button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                    <span key={page} className="px-2">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Pagination Info */}
            {!loading && products.length > 0 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts}{" "}
                    products
                </div>
            )}
        </div>
    );
}
