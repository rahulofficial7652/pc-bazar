"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductList } from "@/components/admin/products/ProductList";
import { CreateProductSheet } from "@/components/admin/products/CreateProductSheet";
import { apiClient } from "@/lib/frontend/api-client";
import { Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await apiClient<any>("/api/v1/products");
    if (data) {
      setProducts(data.products || data); // API might return { products: [], pagination: ... } or just [] depending on implementation. 
      // Checking products/route.ts: returns { products, pagination }.
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle data structure difference if API returns object with products array
  const productList = Array.isArray(products) ? products : (products as any).products || [];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Products</h2>
           <p className="text-muted-foreground">Manage your inventory</p>
        </div>
        <CreateProductSheet onSuccess={fetchProducts} />
      </div>

      {loading ? (
        <div className="flex justify-center h-24 items-center">
            <Loader2 className="animate-spin" />
        </div>
      ) : (
        <ProductList products={productList} onRefresh={fetchProducts} />
      )}
    </div>
  );
}