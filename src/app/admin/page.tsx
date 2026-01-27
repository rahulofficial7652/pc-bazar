"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, DollarSign, Users, Package, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await apiClient<any>("/api/v1/admin/stats");
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  if (!stats) return <div>Failed to load stats</div>;

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
    { title: "Total Products", value: stats.totalProducts, icon: Package, color: "text-green-500" },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-purple-500" },
    { title: "Pending Orders", value: stats.pendingOrders, icon: ShoppingBag, color: "text-orange-500" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
         {/* Could add recent orders table here too, but we have a separate page for that in requirements */}
      </div>
    </div>
  );
}