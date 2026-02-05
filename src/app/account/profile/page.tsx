"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, User, Mail, Phone, Calendar } from "lucide-react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Profile updated successfully!");
            setLoading(false);
        }, 1000);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information
                </p>
            </div>

            {/* Profile Picture */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                {session?.user?.name ? getInitials(session.user.name) : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button variant="outline" disabled>
                                Upload Photo
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                JPG, GIF or PNG. Max size 1MB
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="pl-9"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="pl-9"
                                        placeholder="Enter your email"
                                        disabled
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="pl-9"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Member Since</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={new Date().toLocaleDateString()}
                                        className="pl-9"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setFormData({
                                        name: session?.user?.name || "",
                                        email: session?.user?.email || "",
                                        phone: "",
                                    })
                                }
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground">
                                Last changed 30 days ago
                            </p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </p>
                        </div>
                        <Button variant="outline" disabled>Enable</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
