"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ClientCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        setLoading(true);
        const data = await apiClient<any[]>("/api/v1/categories");
         if (data) {
             setCategories(data);
         }
         setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto py-8 mt-10">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link href={`/products?category=${cat._id}`} key={cat._id}>
            <Card className="hover:bg-muted transition-colors cursor-pointer">
                <CardHeader>
                <CardTitle className="text-center">{cat.name}</CardTitle>
                </CardHeader>
            </Card>
          </Link>
        ))}
         {categories.length === 0 && <p>No categories found.</p>}
      </div>
    </div>
  );
}
