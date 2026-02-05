import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LucideIcon } from "lucide-react";
import { ModeToggle } from "../theme/ModeToggle";
import { SidebarTrigger } from "../ui/sidebar";
import Link from "next/link";

interface NavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  children?: { label: string; href: string; icon?: LucideIcon }[];
}

interface AdminNavbarProps {
  logoFirstPart?: string;
  logoSecondPart?: string;
  menuItems: NavItem[];
  rightMenuItems?: NavItem[];
}

export function AdminNavbar({ menuItems, rightMenuItems }: AdminNavbarProps) {
  return (
    // 'fixed' ki jagah 'sticky' use kiya hai aur 'w-full'
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
