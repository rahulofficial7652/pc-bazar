"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductList } from "@/components/admin/products/ProductList";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button"; // Import Button
import { signOut } from "next-auth/react"; // Import signOut
import { ModeToggle } from "@/components/theme/ModeToggle";

const INITIAL_FORM = {
  name: "",
  price: 0,
  discountPrice: 0,
  stock: 0,
  category: "",
  description: "",
  brand: "",
  images: "",
};

export default function AdminProductsPage() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Specs Builder State
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/v1/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/v1/products?showAll=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product._id);
    const catSlug =
      typeof product.category === "object"
        ? (product.category as Category).slug
        : product.category;

    setForm({
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      category: catSlug as string,
      description: product.description || "",
      brand: product.brand || "",
      images: product.images ? product.images.join("\n") : "",
    });

    const specsArr = Object.entries(product.specs || {}).map(([key, value]) => ({
      key,
      value,
    }));
    setSpecs(specsArr);
    setView("edit");
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill required fields (Name, Price, Category)");
      return;
    }

    setIsLoading(true);

    const specsObj = specs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      ...form,
      images: form.images.split("\n").filter((url) => url.trim() !== ""),
      specs: specsObj,
    };

    try {
      let res;
      if (view === "add") {
        res = await fetch("/api/v1/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/v1/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok) {
        toast.success(view === "add" ? "Product created" : "Product updated");
        setView("list");
        setForm(INITIAL_FORM);
        setSpecs([]);
        setEditingId(null);
        fetchProducts();
      } else {
        toast.error(data.message || data.error?.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (view === "list") {
    return (
      <div className="m-5 space-y-4">
        <div className="flex gap-2 justify-end">
          <ModeToggle/>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            Logout
          </Button>
        </div>
        <ProductList
          // @ts-ignore
          products={products}
          onAdd={() => {
            setForm(INITIAL_FORM);
            setSpecs([]);
            setView("add");
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <div className="m-10 px-5">
      <div className="flex justify-end mb-4">

        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </Button>
      </div>
      <ProductForm
        view={view}
        form={form}
        setForm={setForm}
        // @ts-ignore
        categories={categories}
        specs={specs}
        setSpecs={setSpecs}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => setView("list")}
      />
    </div>
  );
}
