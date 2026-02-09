import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import Link from "next/link"
import { connectDB } from "@/lib/db";
import { Product as ProductModel } from "@/models/product";
import { Product } from "@/lib/home";

export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<import("@/types").Product[]> {
  try {
    await connectDB();
    const products = await ProductModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main>
      {/* Hero Section - Simplified and Static */}
      <section className="relative overflow-hidden bg-background">
        {/* soft background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <p className="uppercase font-medium text-xl">
              pc Bazzar
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Same Store{" "}
              <span className="text-primary">
                You Trust
              </span>
            </h1>

            <p className="mt-6 max-w-md text-muted-foreground">
              We've redesigned our website to offer faster performance and a cleaner shopping experience.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="/collection">
                <Button size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link href="#">
                <Button size="lg" variant="outline">
                  Explore
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative h-[320px] rounded-xl border bg-card shadow-sm" >

          </div>

        </div>
      </section>

      <FeaturedProducts data={products} />
    </main>
  )
}
