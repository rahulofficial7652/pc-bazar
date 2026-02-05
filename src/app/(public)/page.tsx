'use client'
import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import Link from "next/link"

import { featuredProducts } from "@/lib/home";

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
          <div className="relative h-[320px] rounded-xl border bg-card shadow-sm" >

          </div>

        </div>
      </section>

      {/* <Categories data={categories} /> */}
      <FeaturedProducts data={featuredProducts} />
    </main>
  )
}
