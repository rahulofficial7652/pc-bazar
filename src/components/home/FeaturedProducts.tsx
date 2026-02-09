"use client"

import { useState } from "react"
import { Product } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, ArrowRight } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"

export function FeaturedProducts({
  data,
}: {
  data: Product[]
}) {
  const [visibleCount, setVisibleCount] = useState(4);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const showMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const visibleProducts = data.slice(0, visibleCount);

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold mb-10">
          Recent Added Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((p) => {
            const isWishlisted = isInWishlist(p._id);

            return (
              <Card key={p._id} className="overflow-hidden hover:shadow-md transition-shadow group relative">
                <CardContent className="p-4 space-y-4">
                  {/* Image Area with Overlay Buttons */}
                  <div className="h-48 bg-card rounded-md overflow-hidden relative border flex items-center justify-center">
                    <Link href={`/collection/${p.slug || p._id}`} className="w-full h-full flex items-center justify-center">
                      {p.images && p.images.length > 0 ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-contain p-2 transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs italic">No Image</span>
                      )}
                    </Link>

                    {/* Wishlist Button (Top Right) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(p);
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-colors ${isWishlisted
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-background/80 text-muted-foreground hover:bg-background hover:text-red-500"
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  <div>
                    <Link href={`/collection/${p.slug || p._id}`} className="hover:underline">
                      <h4 className="font-semibold line-clamp-1">{p.name}</h4>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {p.description || p.brand || "High Quality Product"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                      </span>
                      {p.discountPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {(p.stock > 0) ? (
                      <Badge variant="secondary" className="text-[10px] h-5">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px] h-5">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 font-bold shadow-sm"
                      disabled={p.stock <= 0}
                      onClick={() => addToCart(p._id)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 font-bold hover:bg-primary hover:text-white transition-colors border-2 group/btn"
                      asChild
                    >
                      <Link href={`/collection/${p.slug || p._id}`} className="flex items-center justify-center">
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {visibleCount < data.length && (
          <div className="mt-12 flex justify-center">
            <Button onClick={showMore} variant="outline" size="lg" className="min-w-[200px]">
              Show More
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

