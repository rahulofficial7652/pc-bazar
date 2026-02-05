"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    User,
    ShoppingBag,
    MapPin,
    Heart,
    Settings,
    LogOut,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarItems = [
    {
        title: "Dashboard",
        url: "/account",
        icon: Package,
    },
    {
        title: "My Orders",
        url: "/account/orders",
        icon: ShoppingBag,
    },
    {
        title: "My Profile",
        url: "/account/profile",
        icon: User,
    },
    {
        title: "Addresses",
        url: "/account/addresses",
        icon: MapPin,
    },
    {
        title: "Wishlist",
        url: "/account/wishlist",
        icon: Heart,
    },
    {
        title: "Settings",
        url: "/account/settings",
        icon: Settings,
    },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
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
        <Card>
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {session?.user?.name ? getInitials(session.user.name) : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <nav className="flex flex-col">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.url;

                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent",
                                    isActive
                                        ? "bg-accent text-accent-foreground border-l-4 border-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground border-t mt-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </nav>
            </CardContent>
        </Card>
    );
}
