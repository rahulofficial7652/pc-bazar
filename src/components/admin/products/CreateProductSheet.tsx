"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/frontend/api-client";

interface CreateProductSheetProps {
  onSuccess: () => void;
}

export function CreateProductSheet({ onSuccess }: CreateProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Using single string for now or comma sep? Schema has array. We'll verify.

  // Categories for select
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (open) {
        // Fetch categories when sheet opens
        setCategoriesLoading(true);
        fetch("/api/v1/categories")
          .then(res => res.json())
          .then(json => {
              console.log("Categories API Response:", json);
              if (json.success && json.data) {
                  setCategories(json.data);
              } else {
                  console.error("Unexpected response structure:", json);
                  setCategories([]);
              }
              setCategoriesLoading(false);
          })
          .catch(err => {
              console.error("Failed to fetch categories:", err);
              setCategoriesLoading(false);
          });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        name,
        slug,
        price: Number(price),
        stock: Number(stock),
        category: categoryId,
        description,
        images: imageUrl ? [imageUrl] : [], // Use array as per schema
    };

    const res = await apiClient("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res) {
      setOpen(false);
      // Reset form
      setName(""); setSlug(""); setPrice(""); setStock(""); setCategoryId(""); setDescription(""); setImageUrl("");
      onSuccess();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Add Product</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Add a new product to your inventory.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Gaming Laptop" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="e.g. gaming-laptop-xyz" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="99.99" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">Loading...</div>
                ) : categories.length > 0 ? (
                    categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))
                ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">No categories found. Please create one.</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
