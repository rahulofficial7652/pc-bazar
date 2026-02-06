import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminNavbar } from "@/components/admin/AdminNavbar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Navbar yahan Inset ke andar rahega toh sidebar ke toggle par auto-adjust hoga */}
        <AdminNavbar/>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}