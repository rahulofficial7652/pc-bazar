"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/frontend/api-client";
import { Category, Product } from "@/types";

/* ---------------------------
   PRODUCT ROW UI (Category-wise)
---------------------------- */

function ProductRow({ category, products }: { category: Category; products: Product[] }) {
  return (
    <section className="mb-16 last:mb-0">
      {/* Category Header */}
      <div className="flex items-end justify-between mb-6 border-b pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {category.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Select from the best {category.name.toLowerCase()}
          </p>
        </div>

        <Link
          href={`/collection/products/category/${category.slug}`}
          className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline group"
        >
          View All{" "}
          <ExternalLink
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Responsive Grid System */}
      <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide sm:grid sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No products available in this category yet.
          </div>
        ) : (
          products.slice(0, 4).map((product) => (
            <Link
              key={product._id}
              href={`/collection/products/${product.slug}`}
              className="min-w-[260px] sm:min-w-0 group border rounded-2xl overflow-hidden bg-card hover:shadow-2xl hover:border-primary/20 transition-all duration-300 ease-in-out flex flex-col"
            >
              {/* Optimized Image View */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}

                {/* Stock Badge */}
                {product.stock > 0 ? (
                  <Badge className="absolute top-3 left-3 bg-green-600">
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 left-3 bg-destructive">
                    Out of Stock
                  </Badge>
                )}

                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <Badge className="absolute top-3 right-3 bg-red-600">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Content with Proper Spacing */}
              <div className="p-4 flex flex-col flex-grow space-y-3">
                <div className="flex-grow">
                  {product.brand && (
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">
                      ₹{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full hover:bg-primary hover:text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to cart logic
                    }}
                  >
                    <ShoppingCart size={18} />
                  </Button>
                </div>

                <Button className="w-full font-bold shadow-sm" variant="default">
                  Select Component
                </Button>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

/* ---------------------------
   SKELETON LOADER
---------------------------- */

function CategoryRowSkeleton() {
  return (
    <section className="mb-16 animate-pulse">
      <div className="flex items-end justify-between mb-6 border-b pb-2">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="h-4 bg-muted rounded w-20" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-w-[260px] border rounded-2xl overflow-hidden bg-card"
          >
            <div className="aspect-square w-full bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <div className="space-y-1">
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                <div className="h-10 w-10 bg-muted rounded-full" />
              </div>
              <div className="h-10 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------
   MAIN PAGE
---------------------------- */

export default function ProductsPageUI() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch all categories
        const categoriesResponse = await apiClient<any>("/api/v1/categories");

        // Handle both wrapped and unwrapped responses
        const categoriesData = categoriesResponse?.data || categoriesResponse;

        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);

          // Fetch products for each category
          const productsPromises = categoriesData.map(async (category: Category) => {
            const productsData = await apiClient<any>(
              `/api/v1/products?category=${category._id}&limit=4`
            );
            return {
              categoryId: category._id,
              products: productsData?.products || [],
            };
          });

          const productsResults = await Promise.all(productsPromises);

          const productsMap: Record<string, Product[]> = {};
          productsResults.forEach((result) => {
            productsMap[result.categoryId] = result.products;
          });

          setProductsByCategory(productsMap);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background">
      {/* Hero / Header Section */}
      <div className="bg-white dark:bg-card border-b py-12 mb-10">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
            PC <span className="text-primary">Bazar</span> Configurator
          </h1>
          <p className="max-w-2xl text-muted-foreground text-base sm:text-lg">
            Apne sapno ka workstation taiyar karein. Best components aur guaranteed
            compatibility ke saath.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          // Show skeleton loaders
          <>
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
            <CategoryRowSkeleton />
          </>
        ) : categories.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              No categories available yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Please add categories from the admin panel first.
            </p>
          </div>
        ) : (
          // Show actual data
          categories.map((category) => (
            <ProductRow
              key={category._id}
              category={category}
              products={productsByCategory[category._id] || []}
            />
          ))
        )}
      </div>
    </div>
  );
}