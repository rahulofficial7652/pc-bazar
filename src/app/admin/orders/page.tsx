"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Order = {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  total: number;
  items: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
};

const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "ORD-2024-001",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    status: "delivered",
    paymentStatus: "paid",
    total: 45000,
    items: 3,
    createdAt: "2024-02-01T10:00:00",
    updatedAt: "2024-02-03T15:30:00",
    shippingAddress: "Mumbai, Maharashtra",
  },
  {
    id: "2",
    orderId: "ORD-2024-002",
    customerName: "Amit Singh",
    customerEmail: "amit@example.com",
    status: "shipped",
    paymentStatus: "paid",
    total: 15000,
    items: 1,
    createdAt: "2024-02-03T14:20:00",
    updatedAt: "2024-02-04T09:15:00",
    shippingAddress: "Delhi, Delhi",
  },
  {
    id: "3",
    orderId: "ORD-2024-003",
    customerName: "Rahul Kumar",
    customerEmail: "rahul@example.com",
    status: "confirmed",
    paymentStatus: "paid",
    total: 85000,
    items: 5,
    createdAt: "2024-02-04T16:45:00",
    updatedAt: "2024-02-04T17:00:00",
    shippingAddress: "Bangalore, Karnataka",
  },
  {
    id: "4",
    orderId: "ORD-2024-004",
    customerName: "Sneha Patel",
    customerEmail: "sneha@example.com",
    status: "pending",
    paymentStatus: "pending",
    total: 12000,
    items: 2,
    createdAt: "2024-02-05T11:30:00",
    updatedAt: "2024-02-05T11:30:00",
    shippingAddress: "Pune, Maharashtra",
  },
  {
    id: "5",
    orderId: "ORD-2024-005",
    customerName: "Vikram Reddy",
    customerEmail: "vikram@example.com",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 25000,
    items: 2,
    createdAt: "2024-02-02T09:00:00",
    updatedAt: "2024-02-02T18:00:00",
    shippingAddress: "Hyderabad, Telangana",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    color: "bg-blue-500",
    textColor: "text-blue-600",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-500",
    textColor: "text-purple-600",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-600",
  },
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient<{ orders: any[] }>("/api/orders?admin=true&limit=100");
      if (data && data.orders) {
        // Map API response to UI Order type
        const mappedOrders = data.orders.map((o: any) => ({
          id: o._id,
          orderId: o._id.substring(0, 8).toUpperCase(), // Fake pretty ID
          customerName: o.user?.name || "Unknown", // Populate user name needed in API!
          customerEmail: o.user?.email || "Unknown",
          status: o.status.toLowerCase(), // API returns UPPERCASE enum
          paymentStatus: o.paymentStatus || "pending",
          total: o.totalAmount,
          items: o.items.length,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          shippingAddress: `${o.shippingAddress?.city}, ${o.shippingAddress?.state}`
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.customerName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.customerEmail?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.total, 0),
    pendingPayments: orders
      .filter((o) => o.paymentStatus === "pending")
      .reduce((sum, o) => sum + o.total, 0),
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder || !newStatus) return;

    try {
      const res = await apiClient<any>(`/api/orders/${editingOrder.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus.toUpperCase() })
      });

      if (res) {
        setOrders(
          orders.map((o) =>
            o.id === editingOrder.id
              ? { ...o, status: newStatus as any, updatedAt: new Date().toISOString() }
              : o
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
        setEditingOrder(null);
        setNewStatus("");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmed + stats.shipped}
            </div>
            <p className="text-xs text-muted-foreground">
              Being processed/shipped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From paid orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ₹{stats.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription>
            Complete order details with delivery tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status].icon;

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderId}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.customerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.items} items</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.paymentStatus === "paid"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              order.paymentStatus === "paid"
                                ? "bg-green-500"
                                : order.paymentStatus === "pending"
                                  ? "bg-yellow-500"
                                  : order.paymentStatus === "refunded"
                                    ? "bg-blue-500"
                                    : "bg-red-500"
                            }
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${statusConfig[order.status].color} text-white`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {order.shippingAddress}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" title="View Details">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(order)}
                              title="Update Status"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Status Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the delivery status for {editingOrder?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <p className="text-sm font-medium capitalize">
                {editingOrder?.status}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="new-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
