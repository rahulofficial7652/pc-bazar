import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Product {
  _id: string;
  name: string;
  price: number;
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products?category=${params.category}`,
    { cache: "no-store" }
  )

  const products = await res.json()

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {products.map((p: Product) => (
        <Card key={p._id}>
          <CardHeader>
            <CardTitle>{p.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>₹{p.price}</p>
          </CardContent>
          <CardFooter>
            <Button>Add to Cart</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
