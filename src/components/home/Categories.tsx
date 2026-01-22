import { Category } from "@/lib/home"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Categories({ data }: { data: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-6">
      {data.map((cat) => (
        <Card key={cat.id}>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold">{cat.title}</h3>
            <p className="text-muted-foreground mt-2">
              {cat.description}
            </p>
            <Button className="mt-6" variant="secondary">
              {cat.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
