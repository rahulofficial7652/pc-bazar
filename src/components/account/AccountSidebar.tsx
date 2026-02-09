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
            <CardHeader className="p-4 md:p-6 border-b">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {session?.user?.name ? getInitials(session.user.name) : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base truncate">{session?.user?.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <nav className="flex flex-row md:flex-col overflow-x-auto scrollbar-hide md:overflow-visible border-b md:border-b-0">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.url;

                        return (
                            <Link
                                key={item.url}
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-2 md:gap-3 px-4 py-3 text-xs md:text-sm font-medium transition-colors hover:bg-accent whitespace-nowrap",
                                    isActive
                                        ? "bg-accent text-accent-foreground border-b-2 md:border-b-0 md:border-l-4 border-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {item.title}
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 md:gap-3 px-4 py-3 text-xs md:text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground border-l md:border-l-0 md:border-t md:mt-2 whitespace-nowrap ml-auto md:ml-0"
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span className="md:inline">Logout</span>
                    </button>
                </nav>
            </CardContent>
        </Card>
    );
}
