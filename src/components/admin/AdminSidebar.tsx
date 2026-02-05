
"use client"

import React from "react"
import { Gauge, ShoppingCart, Package, User, Settings, Users, ShoppingBag } from "lucide-react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

const dashboardItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Gauge
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: ShoppingCart
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: Package
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: ShoppingBag
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings
    },
]

export function AdminSidebar() {
    return (
        <AppSidebar items={dashboardItems} label="Admin" />
    )
}
