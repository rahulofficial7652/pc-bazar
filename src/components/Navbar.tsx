"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import Image from "next/image"
import {
  HomeIcon,
  ShoppingCartIcon,
  CpuIcon,
  MonitorIcon,
  HeadphonesIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  LayoutDashboardIcon,
} from "lucide-react"
import { ModeToggle } from "./theme/ModeToggle"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="w-full border-b fixed top-0 z-50 shadow-sm bg-transparent  backdrop-filter backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        
        {/* LEFT – LOGO */}
        <Link href="/">
         <Image src="/logo.jpeg" alt="Logo" width={40} height={40} className=""/>
        </Link>
   

        {/* CENTER – MENUBAR */}
        <Menubar className="border-none shadow-none">
          
          {/* HOME */}
          <MenubarMenu>
            <MenubarTrigger className="gap-2">
              <HomeIcon size={16} />
              Home
            </MenubarTrigger>
          </MenubarMenu>

          {/* PRODUCTS */}
          <MenubarMenu>
            <MenubarTrigger >Products</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  <CpuIcon className="mr-2 h-4 w-4" />
                  Custom PC
                </MenubarItem>
                <MenubarItem>
                  <MonitorIcon className="mr-2 h-4 w-4" />
                  Monitors
                </MenubarItem>
                <MenubarItem>
                  <HeadphonesIcon className="mr-2 h-4 w-4" />
                  Peripherals
                </MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          {/* CART */}
          <MenubarMenu>
            <MenubarTrigger className="gap-2">
              <ShoppingCartIcon size={16} />
              Cart
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>

        {/* RIGHT – AUTH */}
        <div className="flex">
            <ModeToggle /> 
        <Menubar className="border-none shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="gap-2">  
              <UserIcon size={16} />
              {isLoading ? "..." : session ? "My Account" : "Account"}
            </MenubarTrigger>
            <MenubarContent align="end">
              {session ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {session.user?.name || session.user?.email}
                  </div>
                  <MenubarSeparator />
                  <Link href="/dashboard">
                    <MenubarItem>
                      <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </MenubarItem>
                  </Link>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </MenubarItem>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <MenubarItem>
                      <LogInIcon className="mr-2 h-4 w-4" />
                      Login
                    </MenubarItem>
                  </Link>
                  <MenubarSeparator />
                  <Link href="/signup">
                    <MenubarItem>
                      Register
                    </MenubarItem>
                  </Link>
                </>
              )}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        </div>
      </div>
    </header>
  )
}
