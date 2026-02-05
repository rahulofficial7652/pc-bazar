"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    MapPin,
    Plus,
    Pencil,
    Trash2,
    Home,
    Briefcase,
    Star,
    Loader2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Address = {
    id: string;
    type: "home" | "work" | "other";
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Address>>({
        type: "home",
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await apiClient<{ addresses: any[] }>("/api/user/addresses");
            if (data && data.addresses) {
                const mapped = data.addresses.map((a: any) => ({
                    id: a._id,
                    type: a.type,
                    name: a.name,
                    phone: a.phone,
                    addressLine1: a.addressLine1,
                    addressLine2: a.addressLine2,
                    city: a.city,
                    state: a.state,
                    pincode: a.pincode,
                    isDefault: a.isDefault
                }));
                setAddresses(mapped);
            }
        } catch (error) {
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData(address);
        } else {
            setEditingAddress(null);
            setFormData({
                type: "home",
                name: "",
                phone: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pincode: "",
                isDefault: false,
            });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            if (editingAddress) {
                // Update
                const res = await apiClient<{ addresses: any[] }>("/api/user/addresses", {
                    method: "PUT",
                    body: JSON.stringify({ ...formData, id: editingAddress.id })
                });

                if (res) {
                    toast.success("Address updated successfully");
                    fetchAddresses(); // Re-fetch to sync state fully including defaults logic
                }
            } else {
                // Create
                const res = await apiClient<{ address: any }>("/api/user/addresses", {
                    method: "POST",
                    body: JSON.stringify(formData)
                });

                if (res) {
                    toast.success("Address added successfully");
                    fetchAddresses();
                }
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to save address");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            await apiClient(`/api/user/addresses?id=${id}`, { method: "DELETE" });
            setAddresses(addresses.filter(addr => addr.id !== id));
            toast.success("Address deleted successfully");
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            // We use PUT to update isDefault
            await apiClient("/api/user/addresses", {
                method: "PUT",
                body: JSON.stringify({ id, isDefault: true })
            });
            fetchAddresses(); // Refresh list to update all default flags
            toast.success("Default address updated");
        } catch (error) {
            toast.error("Failed to update default address");
        }
    };

    const getAddressIcon = (type: string) => {
        switch (type) {
            case "home":
                return Home;
            case "work":
                return Briefcase;
            default:
                return MapPin;
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading addresses...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Addresses</h1>
                    <p className="text-muted-foreground">
                        Manage your delivery addresses
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                </Button>
            </div>

            {/* Addresses Grid */}
            {addresses.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                        <p className="text-muted-foreground mb-6 text-center">
                            Add your delivery address to make checkout faster
                        </p>
                        <Button onClick={() => handleOpenDialog()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Address
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => {
                        const Icon = getAddressIcon(address.type);

                        return (
                            <Card key={address.id} className="relative">
                                {address.isDefault && (
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-green-500">
                                            <Star className="h-3 w-3 mr-1" />
                                            Default
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-accent">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg capitalize">
                                                {address.type}
                                            </CardTitle>
                                            <CardDescription>{address.name}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <p>{address.addressLine1}</p>
                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                        <p>
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Phone: {address.phone}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 pt-2 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenDialog(address)}
                                        >
                                            <Pencil className="h-3 w-3 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Delete
                                        </Button>
                                        {!address.isDefault && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSetDefault(address.id)}
                                                className="ml-auto"
                                            >
                                                Set as Default
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add/Edit Address Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? "Update your delivery address details"
                                : "Add a new delivery address"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="type">Address Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: any) =>
                                        setFormData({ ...formData, type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home</SelectItem>
                                        <SelectItem value="work">Work</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Textarea
                                    id="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={(e) =>
                                        setFormData({ ...formData, addressLine1: e.target.value })
                                    }
                                    placeholder="House No., Building Name, Street"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                                <Input
                                    id="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={(e) =>
                                        setFormData({ ...formData, addressLine2: e.target.value })
                                    }
                                    placeholder="Landmark, Area"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state: e.target.value })
                                    }
                                    placeholder="Enter state"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <Input
                                    id="pincode"
                                    value={formData.pincode}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pincode: e.target.value })
                                    }
                                    placeholder="6-digit pincode"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={saveLoading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saveLoading}>
                            {saveLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {editingAddress ? "Update Address" : "Add Address"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
