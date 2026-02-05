"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Bell,
    Mail,
    Shield,
    Smartphone,
    Globe,
    Palette,
    Trash2
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true,
        smsAlerts: false,
    });

    const [privacy, setPrivacy] = useState({
        showProfile: true,
        showOrders: false,
        dataSharing: false,
    });

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications({ ...notifications, [key]: value });
        toast.success("Notification settings updated");
    };

    const handlePrivacyChange = (key: string, value: boolean) => {
        setPrivacy({ ...privacy, [key]: value });
        toast.success("Privacy settings updated");
    };

    const handleDeleteAccount = () => {
        toast.error("Account deletion feature coming soon");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account preferences and settings
                </p>
            </div>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Choose what notifications you want to receive
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="order-updates" className="text-base">
                                Order Updates
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Get notified about your order status
                            </p>
                        </div>
                        <Switch
                            id="order-updates"
                            checked={notifications.orderUpdates}
                            onCheckedChange={(value) =>
                                handleNotificationChange("orderUpdates", value)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="promotions" className="text-base">
                                Promotions & Offers
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive updates about sales and special offers
                            </p>
                        </div>
                        <Switch
                            id="promotions"
                            checked={notifications.promotions}
                            onCheckedChange={(value) =>
                                handleNotificationChange("promotions", value)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="newsletter" className="text-base">
                                Newsletter
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Weekly newsletter with product updates
                            </p>
                        </div>
                        <Switch
                            id="newsletter"
                            checked={notifications.newsletter}
                            onCheckedChange={(value) =>
                                handleNotificationChange("newsletter", value)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="sms-alerts" className="text-base">
                                SMS Alerts
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Get order updates via SMS
                            </p>
                        </div>
                        <Switch
                            id="sms-alerts"
                            checked={notifications.smsAlerts}
                            onCheckedChange={(value) =>
                                handleNotificationChange("smsAlerts", value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        <CardTitle>Privacy & Security</CardTitle>
                    </div>
                    <CardDescription>
                        Control your privacy and security settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-profile" className="text-base">
                                Public Profile
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Make your profile visible to others
                            </p>
                        </div>
                        <Switch
                            id="show-profile"
                            checked={privacy.showProfile}
                            onCheckedChange={(value) =>
                                handlePrivacyChange("showProfile", value)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="show-orders" className="text-base">
                                Show Order History
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Allow others to see your order history
                            </p>
                        </div>
                        <Switch
                            id="show-orders"
                            checked={privacy.showOrders}
                            onCheckedChange={(value) =>
                                handlePrivacyChange("showOrders", value)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="data-sharing" className="text-base">
                                Data Sharing
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Share anonymous data for analytics
                            </p>
                        </div>
                        <Switch
                            id="data-sharing"
                            checked={privacy.dataSharing}
                            onCheckedChange={(value) =>
                                handlePrivacyChange("dataSharing", value)
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <CardTitle>Preferences</CardTitle>
                    </div>
                    <CardDescription>
                        Customize your shopping experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Language</Label>
                            <p className="text-sm text-muted-foreground">
                                Choose your preferred language
                            </p>
                        </div>
                        <Button variant="outline" disabled>
                            English (IN)
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Currency</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your currency preference
                            </p>
                        </div>
                        <Button variant="outline" disabled>
                            ₹ INR
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Theme</Label>
                            <p className="text-sm text-muted-foreground">
                                Choose light or dark mode
                            </p>
                        </div>
                        <Button variant="outline" disabled>
                            System
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>
                        Irreversible actions for your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Delete Account</Label>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete Account</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove all your data from our servers including:
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>Your profile information</li>
                                            <li>Order history</li>
                                            <li>Saved addresses</li>
                                            <li>Wishlist items</li>
                                        </ul>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Yes, Delete My Account
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
