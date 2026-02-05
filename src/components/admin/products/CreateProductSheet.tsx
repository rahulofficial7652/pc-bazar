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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Loader2 } from "lucide-react";
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

  // Basic Info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Specifications
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  // Highlights
  const [highlights, setHighlights] = useState([""]);

  // Features
  const [features, setFeatures] = useState([{ title: "", description: "" }]);

  // Warranty
  const [warrantyDuration, setWarrantyDuration] = useState("");
  const [warrantyType, setWarrantyType] = useState("");
  const [warrantyDetails, setWarrantyDetails] = useState("");

  // Return Policy
  const [returnable, setReturnable] = useState(true);
  const [returnDuration, setReturnDuration] = useState("7 Days");
  const [returnDetails, setReturnDetails] = useState("");

  // Shipping
  const [freeShipping, setFreeShipping] = useState(false);
  const [minOrderForFreeShipping, setMinOrderForFreeShipping] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [shippingDetails, setShippingDetails] = useState("");

  // Manufacturer
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerCountry, setManufacturerCountry] = useState("");
  const [manufacturerAddress, setManufacturerAddress] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCategoriesLoading(true);
      fetch("/api/v1/categories")
        .then(res => res.json())
        .then(json => {
          const categoriesData = json.data || json;
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          setCategoriesLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch categories:", err);
          setCategoriesLoading(false);
        });
    }
  }, [open]);

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      // Basic Info
      name,
      slug,
      description,
      brand,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      category: categoryId,
      images,
      isFeatured,

      // Specs
      specs: specs.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {} as Record<string, string>),

      // Highlights
      highlights: highlights.filter(h => h.trim()),

      // Features
      features: features.filter(f => f.title.trim() || f.description.trim()),

      // Warranty
      warranty: {
        duration: warrantyDuration,
        type: warrantyType,
        details: warrantyDetails,
      },

      // Return Policy
      returnPolicy: {
        returnable,
        duration: returnDuration,
        details: returnDetails,
      },

      // Shipping
      shippingInfo: {
        freeShipping,
        minOrderForFreeShipping: minOrderForFreeShipping ? Number(minOrderForFreeShipping) : undefined,
        estimatedDelivery,
        details: shippingDetails,
      },

      // Manufacturer
      manufacturerDetails: {
        name: manufacturerName,
        country: manufacturerCountry,
        address: manufacturerAddress,
      },

      // SEO
      metaTitle,
      metaDescription,
      tags,
    };

    const res = await apiClient("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res) {
      setOpen(false);
      resetForm();
      onSuccess();
      toast.success("Product created successfully!");
    }
  };

  const resetForm = () => {
    setName(""); setSlug(""); setDescription(""); setBrand("");
    setPrice(""); setDiscountPrice(""); setStock(""); setCategoryId("");
    setImages([]); setIsFeatured(false);
    setSpecs([{ key: "", value: "" }]);
    setHighlights([""]);
    setFeatures([{ title: "", description: "" }]);
    setWarrantyDuration(""); setWarrantyType(""); setWarrantyDetails("");
    setReturnable(true); setReturnDuration("7 Days"); setReturnDetails("");
    setFreeShipping(false); setMinOrderForFreeShipping(""); setEstimatedDelivery(""); setShippingDetails("");
    setManufacturerName(""); setManufacturerCountry(""); setManufacturerAddress("");
    setMetaTitle(""); setMetaDescription(""); setTags([]); setTagInput("");
  };

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

  const addHighlight = () => setHighlights([...highlights, ""]);
  const removeHighlight = (index: number) => {
    const newHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(newHighlights.length ? newHighlights : [""]);
  };
  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const addFeature = () => setFeatures([...features, { title: "", description: "" }]);
  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures.length ? newFeatures : [{ title: "", description: "" }]);
  };
  const updateFeature = (index: number, field: "title" | "description", value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </SheetTrigger>
      <SheetContent
        className="overflow-y-auto w-full sm:max-w-[600px] px-5"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Fill in all product details including features, warranty, and shipping information.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <Accordion type="multiple" defaultValue={["basic", "media"]} className="w-full">

            {/* Basic Information */}
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Information *</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Logitech MX Master 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="logitech-mx-master-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Logitech"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="8999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      placeholder="7999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId} required>
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed product description..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="featured" className="text-sm cursor-pointer">
                    Mark as Featured Product
                  </Label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Product Images */}
            <AccordionItem value="media">
              <AccordionTrigger>Product Images</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
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

                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={loading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const toastId = toast.loading("Uploading image...");

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
                      toast.success("Image uploaded!", { id: toastId });
                    } catch (error) {
                      console.error("Upload error:", error);
                      toast.error("Upload failed", { id: toastId });
                    }

                    e.target.value = "";
                  }}
                />
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                </Label>
              </AccordionContent>
            </AccordionItem>

            {/* Highlights */}
            <AccordionItem value="highlights">
              <AccordionTrigger>Product Highlights</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g. High Performance Processor"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                    />
                    {highlights.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="h-4 w-4 mr-1" /> Add Highlight
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Features */}
            <AccordionItem value="features">
              <AccordionTrigger>Detailed Features</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {features.map((feature, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">Feature {index + 1}</Label>
                      {features.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="h-6 w-6">
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Feature Title"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                    />
                    <Textarea
                      placeholder="Feature Description"
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Specifications */}
            <AccordionItem value="specs">
              <AccordionTrigger>Technical Specifications</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key (e.g. RAM)"
                      value={spec.key}
                      onChange={(e) => updateSpec(index, "key", e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g. 16GB)"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, "value", e.target.value)}
                    />
                    {specs.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                  <Plus className="h-4 w-4 mr-1" /> Add Spec
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Warranty & Services */}
            <AccordionItem value="services">
              <AccordionTrigger>Warranty & Services</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Warranty</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Duration (e.g. 1 Year)"
                      value={warrantyDuration}
                      onChange={(e) => setWarrantyDuration(e.target.value)}
                    />
                    <Input
                      placeholder="Type (e.g. Manufacturer)"
                      value={warrantyType}
                      onChange={(e) => setWarrantyType(e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Warranty details..."
                    value={warrantyDetails}
                    onChange={(e) => setWarrantyDetails(e.target.value)}
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Return Policy</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="returnable"
                      checked={returnable}
                      onCheckedChange={(checked) => setReturnable(checked as boolean)}
                    />
                    <Label htmlFor="returnable" className="text-sm cursor-pointer">
                      Product is Returnable
                    </Label>
                  </div>
                  <Input
                    placeholder="Return Duration (e.g. 7 Days)"
                    value={returnDuration}
                    onChange={(e) => setReturnDuration(e.target.value)}
                  />
                  <Textarea
                    placeholder="Return policy details..."
                    value={returnDetails}
                    onChange={(e) => setReturnDetails(e.target.value)}
                    rows={2}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Shipping Information</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="freeShipping"
                      checked={freeShipping}
                      onCheckedChange={(checked) => setFreeShipping(checked as boolean)}
                    />
                    <Label htmlFor="freeShipping" className="text-sm cursor-pointer">
                      Free Shipping Available
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min Order for Free (₹)"
                      type="number"
                      value={minOrderForFreeShipping}
                      onChange={(e) => setMinOrderForFreeShipping(e.target.value)}
                    />
                    <Input
                      placeholder="Delivery Time (e.g. 3-5 Days)"
                      value={estimatedDelivery}
                      onChange={(e) => setEstimatedDelivery(e.target.value)}
                    />
                  </div>
                  <Textarea
                    placeholder="Shipping details..."
                    value={shippingDetails}
                    onChange={(e) => setShippingDetails(e.target.value)}
                    rows={2}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Manufacturer Details */}
            <AccordionItem value="manufacturer">
              <AccordionTrigger>Manufacturer Details</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <Input
                  placeholder="Manufacturer Name"
                  value={manufacturerName}
                  onChange={(e) => setManufacturerName(e.target.value)}
                />
                <Input
                  placeholder="Country of Origin"
                  value={manufacturerCountry}
                  onChange={(e) => setManufacturerCountry(e.target.value)}
                />
                <Textarea
                  placeholder="Manufacturer Address"
                  value={manufacturerAddress}
                  onChange={(e) => setManufacturerAddress(e.target.value)}
                  rows={2}
                />
              </AccordionContent>
            </AccordionItem>

            {/* SEO */}
            <AccordionItem value="seo">
              <AccordionTrigger>SEO & Marketing</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-4">
                <Input
                  placeholder="Meta Title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Meta Description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                />
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
