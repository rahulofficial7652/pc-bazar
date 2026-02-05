"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
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
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Saved products</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Addresses</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
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
