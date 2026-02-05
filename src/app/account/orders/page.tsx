"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Package,
    Search,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
} from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusConfig: any = {
    pending: {
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    confirmed: {
        label: "Confirmed",
        icon: CheckCircle,
        color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200",
    },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const data = await apiClient<{ orders: any[] }>("/api/orders");
                if (data && data.orders) {
                    const mappedOrders = data.orders.map((o: any) => ({
                        id: o._id,
                        orderId: o._id.substring(0, 8).toUpperCase(),
                        date: o.createdAt,
                        status: o.status.toLowerCase(),
                        total: o.totalAmount,
                        items: o.items.length,
                        products: o.items.map((i: any) => ({
                            name: i.name,
                            image: i.image || "https://placehold.co/80x80/png?text=Product"
                        }))
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error) {
                toast.error("Failed to load your orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-muted-foreground">
                    View and track your previous purchases
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders by Order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                        <p className="text-muted-foreground mb-6 text-center">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "You haven't placed any orders yet"}
                        </p>
                        <Link href="/collection">
                            <Button>Start Shopping</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const statusKey = order.status;
                        const config = statusConfig[statusKey] || statusConfig.pending;
                        const StatusIcon = config.icon;
                        const statusClass = config.color;

                        return (
                            <Card key={order.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <CardTitle className="text-lg">#{order.orderId}</CardTitle>
                                                <CardDescription>
                                                    Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className={`${statusClass} flex items-center gap-1`}
                                            >
                                                <StatusIcon className="h-3 w-3" />
                                                {config.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                        <div className="flex gap-4">
                                            {order.products.length > 0 && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        {/* Simple Image Placeholder check */}
                                                        {order.products[0].image && order.products[0].image.startsWith('http') ? (
                                                            <img
                                                                src={order.products[0].image}
                                                                alt={order.products[0].name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{order.products[0].name}</p>
                                                        {order.items > 1 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                +{order.items - 1} more items
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-3">
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                                <p className="text-xl font-bold">₹{order.total.toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                                {order.status === "delivered" && (
                                                    <Button size="sm">Buy Again</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{orders.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Delivered
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">
                            {orders.filter((o) => o.status === "delivered").length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            In Transit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-blue-600">
                            {orders.filter((o) => o.status === "shipped").length}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Spent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
