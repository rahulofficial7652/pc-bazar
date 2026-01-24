"use client"

import React from "react"
import { Home, Inbox } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"

const dashboardItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "/inbox", icon: Inbox },
]

export function AdminPageSidebar() {``
  return (
    React.createElement(AppSidebar, { items: dashboardItems, label: "" })
  )
}
