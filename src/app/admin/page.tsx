"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Fetch products
      const productsRes = await apiClient<any>("/api/v1/products?limit=1000");
      const products = productsRes?.products || [];

      // Fetch categories
      const categoriesRes = await apiClient<any>("/api/v1/categories");
      const categories = Array.isArray(categoriesRes) ? categoriesRes : [];

      // Calculate stats
      const totalProducts = products.length;
      const activeProducts = products.filter((p: any) => p.isActive).length;
      const outOfStock = products.filter((p: any) => p.stock === 0).length;
      const lowStock = products.filter((p: any) => p.stock > 0 && p.stock < 10).length;
      const totalInventoryValue = products.reduce(
        (sum: number, p: any) => sum + (p.discountPrice || p.price) * p.stock,
        0
      );

      setStats({
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts,
          outOfStock,
          lowStock,
        },
        categories: {
          total: categories.length,
        },
        inventory: {
          totalValue: totalInventoryValue,
        },
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to PC Bazar Admin Panel - Your complete e-commerce management center
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4  w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.products.active} active, {stats.products.inactive} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories.total}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.inventory.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.products.outOfStock + stats.products.lowStock}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.products.outOfStock} out, {stats.products.lowStock} low
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Products Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products Overview
            </CardTitle>
            <CardDescription>Products status breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Active Products</span>
              </div>
              <span className="font-bold">{stats.products.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Inactive Products</span>
              </div>
              <span className="font-bold">{stats.products.inactive}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Out of Stock</span>
              </div>
              <span className="font-bold text-destructive">{stats.products.outOfStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Low Stock</span>
              </div>
              <span className="font-bold text-yellow-600">{stats.products.lowStock}</span>
            </div>
            <Link href="/admin/products" className="block">
              <Button className="w-full mt-4">Manage Products</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                View All Products
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/collection">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Store Front
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Platform details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Platform</span>
              <span className="font-medium">PC Bazar Admin</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Alerts */}
      {(stats.products.outOfStock > 0 || stats.products.lowStock > 0) && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.products.outOfStock > 0 && (
              <p className="text-sm">
                ⚠️ <strong>{stats.products.outOfStock}</strong> products are out of stock.
                <Link href="/admin/products" className="ml-2 text-primary hover:underline">
                  View and restock
                </Link>
              </p>
            )}
            {stats.products.lowStock > 0 && (
              <p className="text-sm">
                📦 <strong>{stats.products.lowStock}</strong> products have low stock (less than 10 units).
                <Link href="/admin/products" className="ml-2 text-primary hover:underline">
                  Review inventory
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}