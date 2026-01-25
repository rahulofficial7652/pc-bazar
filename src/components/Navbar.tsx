import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

import {
  HomeIcon,
  ShoppingCartIcon,
  CpuIcon,
  MonitorIcon,
  HeadphonesIcon,
  UserIcon,
  LogInIcon,
} from "lucide-react"
import { ModeToggle } from "./theme/ModeToggle"

export function Navbar() {
  return (
    <header className="w-full border-b fixed top-0 z-50 shadow-sm bg-transparent  backdrop-filter backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        
        {/* LEFT – LOGO */}
        <div className="text-xl font-bold tracking-tight">
          PC<span className="text-violet-600"> Bazzar</span>
        </div>

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
              Account
            </MenubarTrigger>
            <MenubarContent align="end">
              <MenubarItem>
                <LogInIcon className="mr-2 h-4 w-4" />
                Login
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Register
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        </div>
      </div>
    </header>
  )
}
