"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
        const fetchOrders = async () => {
            setLoading(true);
            const data = await apiClient<any>("/api/v1/orders");
            if (data) {
                setOrders(data.orders || data);
            }
            setLoading(false);
        };
        fetchOrders();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  if (status === "unauthenticated") {
      return <div className="p-10 text-center">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name || "User"}</h1>
      
      <Card>
          <CardHeader>
              <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">You haven't placed any orders yet.</TableCell>
                        </TableRow>
                    ) : (
                        orders.map(order => (
                            <TableRow key={order._id}>
                                <TableCell className="font-mono text-sm">{order._id.substring(0, 8)}...</TableCell>
                                <TableCell>${order.totalAmount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.status}</Badge>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}
