"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ClientProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto update / Re-fetch logic can be SWR but simple useEffect with interval or just load once is basic.
    // "Auto update via API re-fetch" might imply polling or just "UI must re-fetch data after every CRUD action" (Admin).
    // For Client UI, "Auto update" usually means it stays fresh. I'll stick to mount fetch.
    const fetch = async () => {
        setLoading(true);
        const data = await apiClient<any>("/api/v1/products");
         if (data) {
             setProducts(data.products || data);
         }
         setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <div className="aspect-square relative">
                {product.images?.[0] ? (
                     <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">No Image</div>
                )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${product.price}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
        {products.length === 0 && <p>No products available.</p>}
      </div>
    </div>
  );
}
