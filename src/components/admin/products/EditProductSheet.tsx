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
import { Product } from "@/types";

interface EditProductSheetProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditProductSheet({ product, open, onOpenChange, onSuccess }: EditProductSheetProps) {
    const [loading, setLoading] = useState(false);

    // Initialize all states with product data
    const [name, setName] = useState(product.name);
    const [slug, setSlug] = useState(product.slug);
    const [description, setDescription] = useState(product.description || "");
    const [brand, setBrand] = useState(product.brand || "");
    const [price, setPrice] = useState(product.price.toString());
    const [discountPrice, setDiscountPrice] = useState(product.discountPrice?.toString() || "");
    const [stock, setStock] = useState(product.stock.toString());
    const [categoryId, setCategoryId] = useState(typeof product.category === "object" ? product.category._id : product.category);
    const [images, setImages] = useState<string[]>(product.images || []);
    const [isFeatured, setIsFeatured] = useState(product.isFeatured || false);

    const [specs, setSpecs] = useState(
        Object.entries(product.specs || {}).map(([key, value]) => ({ key, value }))
    );

    const [highlights, setHighlights] = useState(product.highlights || [""]);
    const [features, setFeatures] = useState(product.features || [{ title: "", description: "" }]);

    const [warrantyDuration, setWarrantyDuration] = useState(product.warranty?.duration || "");
    const [warrantyType, setWarrantyType] = useState(product.warranty?.type || "");
    const [warrantyDetails, setWarrantyDetails] = useState(product.warranty?.details || "");

    const [returnable, setReturnable] = useState(product.returnPolicy?.returnable ?? true);
    const [returnDuration, setReturnDuration] = useState(product.returnPolicy?.duration || "7 Days");
    const [returnDetails, setReturnDetails] = useState(product.returnPolicy?.details || "");

    const [freeShipping, setFreeShipping] = useState(product.shippingInfo?.freeShipping || false);
    const [minOrderForFreeShipping, setMinOrderForFreeShipping] = useState(product.shippingInfo?.minOrderForFreeShipping?.toString() || "");
    const [estimatedDelivery, setEstimatedDelivery] = useState(product.shippingInfo?.estimatedDelivery || "");
    const [shippingDetails, setShippingDetails] = useState(product.shippingInfo?.details || "");

    const [manufacturerName, setManufacturerName] = useState(product.manufacturerDetails?.name || "");
    const [manufacturerCountry, setManufacturerCountry] = useState(product.manufacturerDetails?.country || "");
    const [manufacturerAddress, setManufacturerAddress] = useState(product.manufacturerDetails?.address || "");

    const [metaTitle, setMetaTitle] = useState(product.metaTitle || "");
    const [metaDescription, setMetaDescription] = useState(product.metaDescription || "");
    const [tags, setTags] = useState<string[]>(product.tags || []);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name, slug, description, brand,
            price: Number(price),
            discountPrice: discountPrice ? Number(discountPrice) : undefined,
            stock: Number(stock),
            category: categoryId,
            images, isFeatured: Boolean(isFeatured),
            specs: specs.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
                return acc;
            }, {} as Record<string, string>),
            highlights: highlights.filter(h => h.trim()),
            features: features.filter(f => f.title.trim() || f.description.trim()),
            warranty: { duration: warrantyDuration, type: warrantyType, details: warrantyDetails },
            returnPolicy: { returnable, duration: returnDuration, details: returnDetails },
            shippingInfo: {
                freeShipping,
                minOrderForFreeShipping: minOrderForFreeShipping ? Number(minOrderForFreeShipping) : undefined,
                estimatedDelivery, details: shippingDetails,
            },
            manufacturerDetails: { name: manufacturerName, country: manufacturerCountry, address: manufacturerAddress },
            metaTitle, metaDescription, tags,
        };

        const res = await apiClient(`/api/v1/products/${product._id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (res) {
            onSuccess();
            toast.success("Product updated successfully!");
        }
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

    // This should match the structure of CreateProductSheet for consistency
    return (
        <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
            <SheetContent
                className="overflow-y-auto w-full sm:max-w-[600px] px-5"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <SheetHeader>
                    <SheetTitle>Edit Product</SheetTitle>
                    <SheetDescription>
                        Update product details, features, warranty, and shipping information.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <Accordion type="multiple" defaultValue={["basic", "media"]} className="w-full">

                        {/* Basic Information */}
                        <AccordionItem value="basic">
                            <AccordionTrigger>Basic Information *</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Product Name *</Label>
                                    <Input
                                        id="edit-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-slug">URL Slug *</Label>
                                    <Input
                                        id="edit-slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-brand">Brand</Label>
                                    <Input
                                        id="edit-brand"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-price">Price (₹) *</Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-discountPrice">Discount Price (₹)</Label>
                                        <Input
                                            id="edit-discountPrice"
                                            type="number"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-stock">Stock *</Label>
                                        <Input
                                            id="edit-stock"
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            required
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
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-featured"
                                        checked={isFeatured}
                                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                                    />
                                    <Label htmlFor="edit-featured" className="text-sm cursor-pointer">
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
                                    id="edit-image-upload"
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
                                    htmlFor="edit-image-upload"
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
                                            placeholder="Highlight"
                                            value={highlight}
                                            onChange={(e) => updateHighlight(index, e.target.value)}
                                        />
                                        {highlights.length > 1 && (
                                            <button type="button" onClick={() => removeHighlight(index)}>
                                                <X className="h-4 w-4 text-destructive" />
                                            </button>
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
                                                <button type="button" onClick={() => removeFeature(index)}>
                                                    <X className="h-4 w-4 text-destructive" />
                                                </button>
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
                                            placeholder="Key"
                                            value={spec.key}
                                            onChange={(e) => updateSpec(index, "key", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Value"
                                            value={spec.value}
                                            onChange={(e) => updateSpec(index, "value", e.target.value)}
                                        />
                                        {specs.length > 1 && (
                                            <button type="button" onClick={() => removeSpec(index)}>
                                                <X className="h-4 w-4 text-destructive" />
                                            </button>
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
                                            placeholder="Duration"
                                            value={warrantyDuration}
                                            onChange={(e) => setWarrantyDuration(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Type"
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
                                            id="edit-returnable"
                                            checked={returnable}
                                            onCheckedChange={(checked) => setReturnable(checked as boolean)}
                                        />
                                        <Label htmlFor="edit-returnable" className="text-sm cursor-pointer">
                                            Product is Returnable
                                        </Label>
                                    </div>
                                    <Input
                                        placeholder="Return Duration"
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
                                            id="edit-freeShipping"
                                            checked={freeShipping}
                                            onCheckedChange={(checked) => setFreeShipping(checked as boolean)}
                                        />
                                        <Label htmlFor="edit-freeShipping" className="text-sm cursor-pointer">
                                            Free Shipping Available
                                        </Label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="Min Order for Free"
                                            type="number"
                                            value={minOrderForFreeShipping}
                                            onChange={(e) => setMinOrderForFreeShipping(e.target.value)}
                                        />
                                        <Input
                                            placeholder="Delivery Time"
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
                                Updating Product...
                            </>
                        ) : (
                            "Update Product"
                        )}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
