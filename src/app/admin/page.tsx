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
  XCircle,
  ShoppingBag,
  Truck,
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

      setLoading(true);
      try {
        const res = await apiClient<any>("/api/admin/stats");
        if (res) {
          setStats(res);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Complete overview of your e-commerce platform
        </p>
      </div>

      {/* Main Stats - 6 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.products.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.users.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.users.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.orders.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(stats.orders.revenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              From orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.categories.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Product types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.products.outOfStock + stats.products.lowStock}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Overview - 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Products Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{stats.products.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active</span>
              <span className="font-medium text-green-600">{stats.products.active}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Out of Stock</span>
              <span className="font-medium text-red-600">{stats.products.outOfStock}</span>
            </div>
            <Link href="/admin/products" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Users Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Registered</span>
              <span className="font-bold">{stats.users.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active</span>
              <span className="font-medium text-green-600">{stats.users.active}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inactive</span>
              <span className="font-medium text-gray-600">
                {stats.users.total - stats.users.active}
              </span>
            </div>
            <Link href="/admin/users" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Orders Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{stats.orders.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium text-yellow-600">{stats.orders.pending}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivered</span>
              <span className="font-medium text-green-600">{stats.orders.delivered}</span>
            </div>
            <Link href="/admin/orders" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">₹{stats.orders.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inventory</span>
              <span className="font-medium">₹{stats.inventory.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Products</span>
              <span className="font-medium">{stats.products.total} items</span>
            </div>
            <Link href="/admin/orders" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                View Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.products.outOfStock > 0 || stats.products.lowStock > 0 || stats.orders.pending > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
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
                    ⚠️ <strong>{stats.products.outOfStock}</strong> products out of stock.
                    <Link href="/admin/products" className="ml-2 text-primary hover:underline">
                      Restock now
                    </Link>
                  </p>
                )}
                {stats.products.lowStock > 0 && (
                  <p className="text-sm">
                    📦 <strong>{stats.products.lowStock}</strong> products low stock ({'<'} 10).
                    <Link href="/admin/products" className="ml-2 text-primary hover:underline">
                      Review
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {stats.orders.pending > 0 && (
            <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-500">
                  <Truck className="h-5 w-5" />
                  Pending Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  📫 <strong>{stats.orders.pending}</strong> orders awaiting confirmation.
                  <Link href="/admin/orders" className="ml-2 text-primary hover:underline">
                    Process now
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}