import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  specs: Record<string, string>;
  description?: string;
  images?: string[];
  brand?: string;
  isActive: boolean;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: productId } = await params;

  // Note: Using absolute URL for server-side fetching in Next.js
  const FETCH_URL = process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/v1/products/${productId}`
    : `http://localhost:3000/api/v1/products/${productId}`;

  let product: Product | null = null;
  let error = null;

  try {
    const res = await fetch(FETCH_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Product not found");
    const data = await res.json();
    product = (data.success && data.data ? data.data : data) as Product;
  } catch (e) {
    error = "Product not found or invalid ID";
  }

  if (!product || error) {
    return <div className="p-10 text-center text-red-500">{error || "Product not found"}</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden border">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain"
            // eslint-disable-next-line @next/next/no-img-element
            />
          ) : (
            <span className="text-muted-foreground">No Image Available</span>
          )}
        </div>
        {/* Gallery Thumbs */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <div key={idx} className="w-20 h-20 border rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={img}
                  alt={`${product.name} ${idx}`}
                  className="w-full h-full object-cover"
                // eslint-disable-next-line @next/next/no-img-element
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Info */}
      <div className="space-y-6">
        <div>
          {product.brand && <Badge variant="outline" className="mb-2">{product.brand}</Badge>}
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground text-lg">{product.category.name}</p>
        </div>

        <div className="flex items-baseline gap-4">
          {product.discountPrice && product.discountPrice < product.price ? (
            <>
              <span className="text-3xl font-bold">₹{product.discountPrice}</span>
              <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
              <Badge variant="destructive">Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%</Badge>
            </>
          ) : (
            <span className="text-3xl font-bold">₹{product.price}</span>
          )}
        </div>

        <div>
          {product.stock > 0 ? (
            <Badge className="bg-green-600 hover:bg-green-700 text-base px-4 py-1">In Stock ({product.stock})</Badge>
          ) : (
            <Badge variant="destructive" className="text-base px-4 py-1">
              Out of Stock
            </Badge>
          )}
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {product.description || "No description available for this product."}
        </p>

        <div className="flex gap-4">
          <Button size="lg" className="flex-1" disabled={product.stock <= 0}>Add to Cart</Button>
          <Button variant="outline" size="lg">Wishlist</Button>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-4">Specifications</h3>
          <div className="border rounded-lg divide-y">
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 p-3 hover:bg-muted/50">
                <span className="font-medium text-muted-foreground col-span-1">{key}</span>
                <span className="col-span-2">{value}</span>
              </div>
            ))}
            {(!product.specs || Object.keys(product.specs).length === 0) && (
              <div className="p-4 text-center text-muted-foreground">No specifications listed.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
