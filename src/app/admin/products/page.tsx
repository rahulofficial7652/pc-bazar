"use client";

import { useEffect, useState } from "react";
import { CreateProductSheet } from "@/components/admin/products/CreateProductSheet";
import { EditProductSheet } from "@/components/admin/products/EditProductSheet";
import { apiClient } from "@/lib/frontend/api-client";
import { Product, Category } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Pencil,
  Trash2,
  Eye,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  X
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const fetchData = async () => {
    setLoading(true);

    // Fetch products
    const productsRes = await apiClient<any>("/api/v1/products?limit=1000");
    if (productsRes?.products) {
      setProducts(productsRes.products);
      setFilteredProducts(productsRes.products);
    }

    // Fetch categories
    const categoriesRes = await apiClient<Category[]>("/api/v1/categories");
    if (categoriesRes) {
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => {
        const cat = p.category as any;
        return cat?._id === selectedCategory || cat?.slug === selectedCategory;
      });
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      result = result.filter(p => p.stock > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter(p => p.stock === 0);
    } else if (stockFilter === "low-stock") {
      result = result.filter(p => p.stock > 0 && p.stock < 10);
    }

    // Status filter
    if (statusFilter === "active") {
      result = result.filter(p => p.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter(p => !p.isActive);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case "price-low":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-high":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "stock-low":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-high":
        result.sort((a, b) => b.stock - a.stock);
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, stockFilter, statusFilter, sortBy, products]);

  const handleDelete = async (id: string) => {
    const res = await apiClient(`/api/v1/products/${id}`, {
      method: "DELETE",
    });

    if (res) {
      toast.success("Product deleted successfully!");
      fetchData();
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    for (const id of selectedProducts) {
      await apiClient(`/api/v1/products/${id}`, { method: "DELETE" });
    }

    toast.success(`${selectedProducts.length} products deleted`);
    setSelectedProducts([]);
    fetchData();
  };

  const handleBulkStatusChange = async (active: boolean) => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    for (const id of selectedProducts) {
      await apiClient(`/api/v1/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: active }),
      });
    }

    toast.success(`${selectedProducts.length} products ${active ? 'activated' : 'deactivated'}`);
    setSelectedProducts([]);
    fetchData();
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setStockFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
  };

  // Stats calculations
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.discountPrice || p.price) * p.stock, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your product catalog with advanced filters
          </p>
        </div>
        <CreateProductSheet onSuccess={fetchData} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Need restock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              {'<'} 10 units
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Based on current prices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, slug, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {(searchQuery || selectedCategory !== "all" || stockFilter !== "all" || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock ({'<'} 10)</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {selectedProducts.length > 0 && (
              <div className="flex gap-2">
                <span>{selectedProducts.length} selected</span>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(true)}>
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange(false)}>
                  Deactivate
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="rounded-lg border mx-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onCheckedChange={() => toggleProductSelection(product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative w-[60px] h-[60px] rounded-md overflow-hidden bg-muted">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground">
                            {product.brand}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {typeof product.category === "object" ? (
                        <Badge variant="outline">
                          {product.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          ₹{(product.discountPrice || product.price).toLocaleString()}
                        </p>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{product.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/collection/${product.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="View Product">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditProduct(product)}
                          title="Edit Product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(product._id)}
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this product. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Product Sheet */}
      {editProduct && (
        <EditProductSheet
          product={editProduct}
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
          onSuccess={() => {
            fetchData();
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
}