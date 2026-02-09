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
import { cn } from "@/lib/utils";
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
    // ... (logic remains same)
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
            description: "Track, return, or buy again",
            icon: ShoppingBag,
            href: "/account/orders",
            color: "text-blue-500",
        },
        {
            title: "My Profile",
            description: "Edit your information",
            icon: User,
            href: "/account/profile",
            color: "text-green-500",
        },
        {
            title: "My Addresses",
            description: "Edit delivery addresses",
            icon: MapPin,
            href: "/account/addresses",
            color: "text-orange-500",
        },
        {
            title: "My Wishlist",
            description: "Manage your saved items",
            icon: Heart,
            href: "/account/wishlist",
            color: "text-red-500",
        },
    ];

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Welcome Section */}
            <Card className="border-none shadow-sm md:border-solid md:shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl">
                        Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Manage your account, orders, and preferences from your dashboard
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}>
                            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 group">
                                <CardHeader className="p-4 md:p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-lg bg-accent transition-colors group-hover:bg-primary/10", link.color)}>
                                                <Icon className="h-5 w-5 md:h-6 md:w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base md:text-lg">{link.title}</CardTitle>
                                                <CardDescription className="mt-0.5 md:mt-1 text-[10px] md:text-xs">
                                                    {link.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
                    <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Your recent orders and updates</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : recentOrder ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg gap-3">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                    <Package className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm md:text-base truncate">Order #{recentOrder._id.substring(0, 8)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(recentOrder.createdAt).toLocaleDateString()} • ₹{recentOrder.totalAmount}
                                    </p>
                                </div>
                            </div>
                            <Badge className="w-fit" variant={recentOrder.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                {recentOrder.status}
                            </Badge>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-accent/20 rounded-lg">
                            <Package className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3" />
                            <p className="text-xs md:text-sm text-muted-foreground mb-4">
                                No recent orders
                            </p>
                            <Link href="/collection">
                                <Button size="sm">
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Start Shopping
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Orders</CardTitle>
                        <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold">{stats.orders}</div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Wishlist</CardTitle>
                        <Heart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold">{stats.wishlist}</div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Saved</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2 md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 pb-1 md:pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium">Addresses</CardTitle>
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-3 md:p-4 pt-0">
                        <div className="text-lg md:text-2xl font-bold">{stats.addresses}</div>
                        <p className="text-[10px] md:text-xs text-muted-foreground">Delivery</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
