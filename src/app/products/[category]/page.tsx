import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  specs: Record<string, string>;
  isActive: boolean;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/products?category=${params.category}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const products = (data.success && data.data ? data.data : data) as Product[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((p) => (
        <Card key={p._id}>
          <CardHeader>
            <CardTitle>{p.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-lg">₹{p.price}</p>
            <div className="mt-2">
              {Object.entries(p.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">
                    {key}:
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            {p.stock > 0 ? (
              <Badge className="mt-2">In Stock</Badge>
            ) : (
              <Badge variant="destructive" className="mt-2">
                Out of Stock
              </Badge>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/products/${p.category.slug}/${p._id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
