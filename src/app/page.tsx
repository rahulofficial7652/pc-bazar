'use client'
import { Button } from "@/components/ui/button"
import { Categories } from "@/components/home/Categories"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import Link from "next/link"

// Static data directly in the page
const categories = [
  {
    id: "custom-pc",
    title: "Custom PC",
    description: "Build your PC exactly the way you want.",
    cta: "Start Building",
  },
  {
    id: "peripherals",
    title: "Peripherals",
    description: "Everything you need for your setup.",
    cta: "Explore",
  },
  {
    id: "monitors",
    title: "Monitors",
    description: "Top brands and stunning displays.",
    cta: "View Monitors",
  },
  {
    id: "prebuilt",
    title: "Prebuilt PC",
    description: "Ready-to-use powerful machines.",
    cta: "Shop Now",
  },
]

const featuredProducts = Array.from({ length: 8 }).map((_, i) => ({
  id: `p-${i}`,
  name: "Gaming PC",
  subtitle: "High performance build",
  price: 59999 + i * 2000,
  inStock: true,
}))

export default function HomePage() {
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
              <Button size="lg">
                Shop Now
              </Button>
              <Link href="/categories">
                <Button size="lg" variant="outline">
                  Explore
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative h-[320px] rounded-xl border bg-card shadow-sm" />
        </div>
      </section>

      <Categories data={categories} />
      <FeaturedProducts data={featuredProducts} />
    </main>
  )
}
