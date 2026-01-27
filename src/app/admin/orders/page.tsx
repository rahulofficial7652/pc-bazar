"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await apiClient<any>("/api/v1/orders");
      if (data) {
        setOrders(data.orders || data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 space-y-8">
       <div>
           <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
           <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">No orders found.</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">{order._id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.user?.name || order.user?.email || "Unknown"}</TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                      <Badge variant={
                          order.status === "DELIVERED" ? "default" : 
                          order.status === "CANCELLED" ? "destructive" : "secondary"
                      }>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
