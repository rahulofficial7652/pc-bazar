import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminNavbar } from "@/components/admin/adminNavbar"
import { HomeIcon, CpuIcon } from "lucide-react"
import { AdminPageSidebar } from "@/lib/sidebar/homePage"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menuData = [
    { label: "Home", href: "/admin", icon: HomeIcon },
    { label: "Products", children: [{ label: "Custom PC", href: "/pc", icon: CpuIcon }] }
  ]

  return (
    <SidebarProvider>
     <AdminPageSidebar/>
      <SidebarInset>
        {/* Navbar yahan Inset ke andar rahega toh sidebar ke toggle par auto-adjust hoga */}
        <AdminNavbar menuItems={menuData} />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-[4.5rem]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}