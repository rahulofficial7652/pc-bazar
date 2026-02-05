"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import {
  HomeIcon,
  ShoppingCartIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PackageIcon,
  ChevronRightIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/theme/ModeToggle";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import { useCategories } from "@/hooks/useCategories";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <header className="w-full border-b fixed top-0 z-50 shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* LEFT – LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpeg" alt="PC Bazar" width={40} height={40} className="rounded-md" />
          <span className="font-bold text-lg hidden sm:inline-block">PC Bazar</span>
        </Link>

        {/* CENTER – MENUBAR (Desktop) */}
        <Menubar className="hidden md:flex border-none shadow-none">

          {/* ALL PRODUCTS */}
          <MenubarMenu>
            <Link href="/collection">
              <MenubarTrigger className="gap-2 cursor-pointer">
                <HomeIcon size={16} />
                All Products
              </MenubarTrigger>
            </Link>
          </MenubarMenu>

          {/* CATEGORIES DROPDOWN */}
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer gap-2">
              <PackageIcon size={16} />
              Categories
            </MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                {categoriesLoading ? (
                  <MenubarItem disabled>Loading categories...</MenubarItem>
                ) : categories.length === 0 ? (
                  <MenubarItem disabled>No categories available</MenubarItem>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/collection/category/${category.slug}`}
                    >
                      <MenubarItem className="gap-2">
                        <PackageIcon size={14} />
                        {category.name}
                      </MenubarItem>
                    </Link>
                  ))
                )}
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>

          {/* CART */}
          <MenubarMenu>
            <Link href="/cart">
              <MenubarTrigger className="gap-2 cursor-pointer">
                <ShoppingCartIcon size={16} />
                Cart
              </MenubarTrigger>
            </Link>
          </MenubarMenu>
        </Menubar>

        {/* RIGHT – AUTH & MOBILE TOGGLE */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ModeToggle />

          {/* DESKTOP ACCOUNT MENU */}
          <Menubar className="hidden sm:flex border-none shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="gap-2">
                <UserIcon size={16} />
                {isLoading ? "..." : session ? "Account" : "Login"}
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
                    {/* @ts-ignore */}
                    {session.user?.role === "ADMIN" && (
                      <>
                        <MenubarSeparator />
                        <Link href="/admin/products">
                          <MenubarItem>
                            <PackageIcon className="mr-2 h-4 w-4" />
                            Admin Panel
                          </MenubarItem>
                        </Link>
                      </>
                    )}
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
                        <UserIcon className="mr-2 h-4 w-4" />
                        Register
                      </MenubarItem>
                    </Link>
                  </>
                )}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          {/* MOBILE MENU */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 outline-none hover:bg-accent rounded-md">
                  <MenuIcon size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] overflow-y-auto">
                <SheetHeader className="text-left mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2">

                  {/* Home Link */}
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                  >
                    <HomeIcon size={20} /> Home
                  </Link>

                  {/* All Products Link */}
                  <Link
                    href="/collection"
                    className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                  >
                    <PackageIcon size={20} /> All Products
                  </Link>

                  {/* Categories Section */}
                  <div className="mt-2">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </div>
                    {categoriesLoading ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Loading categories...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {categories.map((category) => (
                          <Link
                            key={category._id}
                            href={`/collection/category/${category.slug}`}
                            className="flex items-center justify-between gap-2 text-base font-medium p-3 pl-6 hover:bg-accent rounded-md transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <PackageIcon size={18} />
                              {category.name}
                            </span>
                            <ChevronRightIcon size={16} className="text-muted-foreground" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Link */}
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors mt-2"
                  >
                    <ShoppingCartIcon size={20} /> Cart
                  </Link>

                  <div className="border-t my-3" />

                  {/* Account Section */}
                  {session ? (
                    <>
                      <div className="px-3 py-2 text-sm font-bold truncate bg-muted rounded-md">
                        {session.user?.name || session.user?.email}
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <LayoutDashboardIcon size={20} /> Dashboard
                      </Link>
                      {/* @ts-ignore */}
                      {session.user?.role === "ADMIN" && (
                        <Link
                          href="/admin/products"
                          className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                        >
                          <PackageIcon size={20} /> Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors text-destructive"
                      >
                        <LogOutIcon size={20} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <LogInIcon size={20} /> Login
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center gap-2 text-base font-medium p-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <UserIcon size={20} /> Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
