"use client"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LucideIcon, HomeIcon, CpuIcon } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";
import LogoutButton from "../logout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: { label: string; href: string; icon?: LucideIcon }[];
}

interface AdminNavbarProps {
  logoFirstPart?: string;
  logoSecondPart?: string;
  menuItems?: NavItem[];
  rightMenuItems?: NavItem[];
}

const defaultMenuItems: NavItem[] = [
  { label: "Home", href: "/admin", icon: HomeIcon },
  { label: "Products", children: [{ label: "Custom PC", href: "/pc", icon: CpuIcon }] }
]

export function AdminNavbar({ 
  menuItems = defaultMenuItems, 
  rightMenuItems 
}: AdminNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout Failed. Please try again.");
      console.error(error);
    }
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <SidebarTrigger className="ml-1 ease-in-out duration-300 hover:scale-110" />
        {/* CENTER SECTION - Desktop Only */}
        <div className="hidden lg:flex">
          <Menubar className="border-none shadow-none bg-transparent">
            {menuItems.map((item, idx) => (
              <MenubarMenu key={idx}>
                <MenubarTrigger className="gap-2 cursor-pointer">
                  {item.icon && <item.icon size={16} />}
                  {item.href ? (
                    <Link href={item.href}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </MenubarTrigger>
                {item.children && (
                  <MenubarContent>
                    <MenubarGroup>
                      {item.children.map((child, cIdx) => (
                        <MenubarItem key={cIdx} asChild>
                          <Link
                            href={child.href}
                            className="flex items-center gap-2"
                          >
                            {child.icon && <child.icon size={16} />}
                            {child.label}
                          </Link>
                        </MenubarItem>
                      ))}
                    </MenubarGroup>
                  </MenubarContent>
                )}
              </MenubarMenu>
            ))}
          </Menubar>
        </div>

        {/* RIGHT SECTION - ModeToggle + Account */}
        <div className="flex items-center gap-1 md:gap-2">
          <ModeToggle />
          <LogoutButton onLogout={handleLogout} />
          <Menubar className="border-none shadow-none bg-transparent">
            {rightMenuItems?.map((item, idx) => (
              <MenubarMenu key={idx}>
                <MenubarTrigger className="gap-2 cursor-pointer pr-0 md:pr-4">
                  {item.icon && <item.icon size={16} />}
                  <span className="hidden sm:inline">{item.label}</span>
                </MenubarTrigger>
                <MenubarContent align="end">
                  {item.children?.map((child, cIdx) => (
                    <MenubarItem key={cIdx} asChild>
                      <Link href={child.href} className="w-full cursor-pointer">
                        {child.label}
                      </Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            ))}
          </Menubar>
        </div>
      </div>
    </header>
  );
}
