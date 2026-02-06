"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingBag,
    MapPin,
    Heart,
    User,
    ArrowRight,
    Package,
    Truck,
} from "lucide-react";

export default function AccountDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({
        orders: 0,
        wishlist: 0,
        addresses: 0
    });
    const [recentOrder, setRecentOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user) return;
            
            setLoading(true);
            try {
                // Fetch orders
                const ordersRes = await apiClient<any>("/api/orders?limit=1");
                const ordersData = ordersRes?.orders || [];
                
                // Fetch wishlist
                const wishlistRes = await apiClient<any>("/api/user/wishlist");
                const wishlistData = wishlistRes?.wishlist || [];

                // Fetch addresses
                const addressesRes = await apiClient<any>("/api/user/addresses");
                const addressesData = addressesRes?.addresses || [];

                setStats({
                    orders: ordersRes?.totalOrders || ordersData.length,
                    wishlist: wishlistData.length,
                    addresses: addressesData.length
                });

                 // Re-fetch orders fully to get count correctly
                 const allOrdersRes = await apiClient<any>("/api/orders");
                 if (allOrdersRes?.orders) {
                     setStats(prev => ({ ...prev, orders: allOrdersRes.orders.length }));
                     if (allOrdersRes.orders.length > 0) {
                         setRecentOrder(allOrdersRes.orders[0]);
                     }
                 }

            } catch (error) {
                console.error("Failed to fetch user stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [session]);

    const quickLinks = [
        {
            title: "My Orders",
            description: "Track, return, or buy things again",
            icon: ShoppingBag,
            href: "/account/orders",
            color: "text-blue-500",
        },
        {
            title: "My Profile",
            description: "Edit your personal information",
            icon: User,
            href: "/account/profile",
            color: "text-green-500",
        },
        {
            title: "My Addresses",
            description: "Edit or add delivery addresses",
            icon: MapPin,
            href: "/account/addresses",
            color: "text-orange-500",
        },
        {
            title: "My Wishlist",
            description: "View and manage your saved items",
            icon: Heart,
            href: "/account/wishlist",
            color: "text-red-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
                    </CardTitle>
                    <CardDescription>
                        Manage your account, orders, and preferences from your dashboard
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg bg-accent", link.color)}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{link.title}</CardTitle>
                                                <CardDescription className="mt-1">
                                                    {link.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent orders and updates</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="text-center py-8">Loading...</div>
                    ) : recentOrder ? (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                    <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium">Order #{recentOrder._id.substring(0, 8)}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(recentOrder.createdAt).toLocaleDateString()} • ₹{recentOrder.totalAmount}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={recentOrder.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                {recentOrder.status}
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground mb-4">
                                No recent orders
                            </p>
                            <Link href="/collection">
                                <Button>
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Start Shopping
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.orders}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.wishlist}</div>
                        <p className="text-xs text-muted-foreground">Saved products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Addresses</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.addresses}</div>
                        <p className="text-xs text-muted-foreground">Saved addresses</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
