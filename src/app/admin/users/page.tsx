"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    Search,
    UserCheck,
    UserX,
    ShoppingBag,
    Eye,
    Ban,
    CheckCircle,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type User = {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    ordersCount: number;
    totalSpent: number;
    wishlistCount: number;
    cartCount: number;
};

// Mock users data
const mockUsers: User[] = [
    {
        id: "1",
        name: "Rahul Kumar",
        email: "rahul@example.com",
        role: "ADMIN",
        isActive: true,
        createdAt: "2024-01-15",
        lastLogin: "2024-02-05",
        ordersCount: 5,
        totalSpent: 125000,
        wishlistCount: 3,
        cartCount: 1,
    },
    {
        id: "2",
        name: "Priya Sharma",
        email: "priya@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-20",
        lastLogin: "2024-02-04",
        ordersCount: 3,
        totalSpent: 45000,
        wishlistCount: 8,
        cartCount: 2,
    },
    {
        id: "3",
        name: "Amit Singh",
        email: "amit@example.com",
        role: "USER",
        isActive: true,
        createdAt: "2024-01-25",
        lastLogin: "2024-02-03",
        ordersCount: 1,
        totalSpent: 15000,
        wishlistCount: 5,
        cartCount: 0,
    },
    {
        id: "4",
        name: "Sneha Patel",
        email: "sneha@example.com",
        role: "USER",
        isActive: false,
        createdAt: "2024-02-01",
        lastLogin: "2024-02-02",
        ordersCount: 0,
        totalSpent: 0,
        wishlistCount: 2,
        cartCount: 1,
    },
];

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await apiClient<User[]>("/api/admin/users");
            if (data) setUsers(data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "inactive" && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter((u) => u.isActive).length,
        admins: users.filter((u) => u.role === "ADMIN").length,
        withOrders: users.filter((u) => u.ordersCount > 0).length,
        totalRevenue: users.reduce((sum, u) => sum + (u.totalSpent || 0), 0),
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await apiClient("/api/admin/users", {
                method: "PATCH",
                body: JSON.stringify({ id: userId, isActive: !currentStatus })
            });

            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, isActive: !u.isActive } : u
                )
            );
            toast.success("User status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getInitials = (name: string) => {
        return (name || "U")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">
                    Monitor and manage all registered users
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active} active
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.active}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((stats.active / stats.total) * 100)}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">With Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.withOrders}
                        </div>
                        <p className="text-xs text-muted-foreground">Paid customers</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        <UserCheck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {stats.admins}
                        </div>
                        <p className="text-xs text-muted-foreground">Admin users</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{stats.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">From all users</p>
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
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="USER">Users</SelectItem>
                                <SelectItem value="ADMIN">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        All Users ({filteredUsers.length})
                    </CardTitle>
                    <CardDescription>
                        Detailed information about each registered user
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-center">Orders</TableHead>
                                    <TableHead className="text-center">Spent</TableHead>
                                    <TableHead className="text-center">Wishlist</TableHead>
                                    <TableHead className="text-center">Cart</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Last login:{" "}
                                                            {user.lastLogin
                                                                ? new Date(user.lastLogin).toLocaleDateString()
                                                                : "Never"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.role === "ADMIN" ? "default" : "secondary"
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{user.ordersCount}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">
                                                ₹{user.totalSpent.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{user.wishlistCount}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{user.cartCount}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={user.isActive ? "default" : "secondary"}
                                                    className={user.isActive ? "bg-green-500" : ""}
                                                >
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                        title={
                                                            user.isActive
                                                                ? "Deactivate User"
                                                                : "Activate User"
                                                        }
                                                    >
                                                        {user.isActive ? (
                                                            <Ban className="h-4 w-4 text-destructive" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
