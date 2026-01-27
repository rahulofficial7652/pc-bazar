"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/lib/frontend/api-client";
import { useState } from "react";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: { name: string } | null;
  images: string[];
}

interface ProductListProps {
  products: Product[];
  onRefresh: () => void;
}

export function ProductList({ products, onRefresh }: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    const res = await apiClient(`/api/v1/products/${id}`, {
      method: "DELETE",
    });
    setDeletingId(null);

    if (res) {
      onRefresh();
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                    {product.images?.[0] ? (
                        <div className="relative w-8 h-8 rounded overflow-hidden">
                             <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-muted rounded" />
                    )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category?.name || "N/A"}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
