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
import { Plus, X, Upload } from "lucide-react";
import { apiClient } from "@/lib/frontend/api-client";
import { uploadImage } from "@/app/actions";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';

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
  const [images, setImages] = useState<string[]>([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs.length ? newSpecs : [{ key: "", value: "" }]);
  };
  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

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
        images, // Now using the images array from state
        specs: specs.reduce((acc, curr) => {
          if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
          return acc;
        }, {} as Record<string, string>)
    };

    const res = await apiClient("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res) {
      setOpen(false);
      // Reset form
      setName(""); setSlug(""); setPrice(""); setStock(""); setCategoryId(""); setDescription(""); setImages([]); setSpecs([{ key: "", value: "" }]);
      onSuccess();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button >Add Product</Button>
      </SheetTrigger>
      <SheetContent 
        className="overflow-y-auto w-[400px] sm:w-[540px] px-5"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on the Cloudinary Widget (which is "outside")
          e.preventDefault();
        }}
      >
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
            <Label>Product Images</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
                {images.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                        <img src={url} alt="Product" className="object-cover w-full h-full" />
                        <button 
                            type="button" 
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                className="hidden"
                disabled={loading}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const toastId = toast.loading("Compressing & Uploading image...");
                    
                    try {
                        const options = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true
                        };
                        
                        const compressedFile = await imageCompression(file, options);
                        
                        const formData = new FormData();
                        formData.append("image", compressedFile);
                        
                        const res = await uploadImage(formData);
                        setImages([...images, res.url]);
                        toast.success("Image uploaded successfully", { id: toastId });
                    } catch (error) {
                        console.error("Upload error:", error);
                        toast.error("Image upload failed", { id: toastId });
                    }
                    
                    // Reset input
                    e.target.value = "";
                }}
              />
              <Label 
                htmlFor="image-upload" 
                className={`flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Click to upload image</span>
                  </div>
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product details..." />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Specs (Key-Value)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpec} className="h-8 px-2">
                <Plus className="h-4 w-4 mr-1" /> Add Spec
              </Button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    placeholder="Key (e.g. RAM)" 
                    value={spec.key} 
                    onChange={(e) => updateSpec(index, "key", e.target.value)}
                    className="flex-1"
                  />
                  <Input 
                    placeholder="Value (e.g. 16GB)" 
                    value={spec.value} 
                    onChange={(e) => updateSpec(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  {specs.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSpec(index)}
                      className="h-9 w-9 text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
