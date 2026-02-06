import { Product } from "@/lib/home"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function FeaturedProducts({
  data,
}: {
  data: Product[]
}) {
  return (
    <section className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold mb-10">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-4">
                <div className="h-40 bg-muted rounded-md" />

                <div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {p.subtitle}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    ₹{p.price}
                  </span>
                  {p.inStock && (
                    <Badge variant="secondary">
                      In Stock
                    </Badge>
                  )}
                </div>

                <Link href={`/product/${p.id}`} className="w-full">
                  <Button size="sm" className="w-full">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
