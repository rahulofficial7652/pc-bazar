import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SpecsBuilder } from "./SpecsBuilder";
import { Category } from "@/types";

interface ProductFormProps {
    view: "add" | "edit";
    form: any;
    setForm: (form: any) => void;
    categories: Category[];
    specs: { key: string; value: string }[];
    setSpecs: (specs: { key: string; value: string }[]) => void;
    isLoading: boolean;
    onSubmit: () => void;
    onCancel: () => void;
}

export function ProductForm({
    view,
    form,
    setForm,
    categories,
    specs,
    setSpecs,
    isLoading,
    onSubmit,
    onCancel,
}: ProductFormProps) {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: Number(e.target.value) });
    };

    return (
        <div className="max-w-4xl mx-auto my-6">
            <div className="mb-4">
                <Button variant="ghost" onClick={onCancel}>
                    &larr; Back to List
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {view === "add" ? "Add New Product" : "Edit Product"}
                    </CardTitle>
                    <CardDescription>Fill in the details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={handleInputChange}
                                placeholder="Gaming Laptop"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={form.category}
                                onValueChange={(val) => setForm({ ...form, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c._id} value={c.slug}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                value={form.brand}
                                onChange={handleInputChange}
                                placeholder="TechCorp"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock *</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={form.price}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                            <Input
                                id="discountPrice"
                                type="number"
                                value={form.discountPrice}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={form.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">Image URLs (One per line)</Label>
                        <Textarea
                            id="images"
                            value={form.images}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        />
                    </div>

                    {/* Specs Builder Component */}
                    <SpecsBuilder specs={specs} setSpecs={setSpecs} />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} disabled={isLoading}>
                        {isLoading
                            ? "Saving..."
                            : view === "add"
                                ? "Create Product"
                                : "Update Product"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
