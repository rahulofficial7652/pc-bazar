
"use client"

import React from "react"
import { Gauge, ShoppingCart, Package, User, Settings } from "lucide-react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

const dashboardItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Gauge
    },
    {
        title: "Product",
        url: "/admin/products",
        icon: ShoppingCart
    },
    {
        title: "All Order",
        url: "/inbox",
        icon: Package
    },
    {
        title: "All User",
        url: "/inbox",
        icon: User
    },
    {
        title: "Settings",
        url: "/inbox",
        icon: Settings
    },
]

export function AdminSidebar() {
    return (
        <AppSidebar items={dashboardItems} label="Admin" />
    )
}
