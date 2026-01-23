import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Product, Category } from "@/types";


interface ProductListProps {
    products: Product[];
    onAdd: () => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export function ProductList({ products, onAdd, onEdit, onDelete }: ProductListProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Products</h1>
                <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No products found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                        {products.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell className="font-medium">
                                    {p.name}
                                    {!p.isActive && (
                                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                            Deleted
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {typeof p.category === "object"
                                        ? (p.category as Category).name
                                        : "Unknown"}
                                </TableCell>
                                <TableCell>${p.price}</TableCell>
                                <TableCell>{p.stock}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onEdit(p)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => onDelete(p._id)}
                                        disabled={!p.isActive}
                                        title={!p.isActive ? "Already deleted" : "Delete"}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
