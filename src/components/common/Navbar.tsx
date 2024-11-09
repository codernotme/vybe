"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Settings2, LogOut, Menu, X } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@nextui-org/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import TButton from "@/components/theme/TButton";

import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "next-themes";
import Navbarcontent from "./navbar-content";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useQuery(api.users.get);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`relative overflow-hidden border-b bg-background ${theme === "dark" ? "border-gray-800" : "border-gray-300"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold md:text-3xl logo">VYBE </h1>
            </Link>
          </motion.div>

          {/* Search & Nav Items (Desktop) */}
          <div className="hidden md:flex items-center gap-4 p-2">
            <div className="flex items-center gap-4">
              <motion.div
                className="relative w-full max-w-[400px]"
                whileHover={{ scale: 1.02 }}
              >
                <Search
                  className={`absolute left-3 top-3 h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                />
                <Input
                  type="search"
                  placeholder="Search for people etc..."
                  className={`w-full pl-10 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 ${theme === "dark" ? "bg-secondary border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black placeholder-gray-500"}`}
                  aria-label="Search"
                />
              </motion.div>
              <Navbarcontent />
              <TButton />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    className={`h-[40px] w-[40px] rounded-full cursor-pointer border-2 ${theme === "dark" ? "border-blue-500" : "border-blue-600"}`}
                    src={user?.imageUrl}
                    alt={user?.username}
                  />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`bg-gray-900 border border-gray-700 ${theme === "dark" ? "text-gray-300" : "bg-white text-black"}`}
              >
                <DropdownMenuLabel>
                  <p className="font-semibold">Signed in as</p>
                  <p
                    className={`font-semibold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Button
                    className={`w-full rounded-lg shadow-black ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <Settings2 className="mr-2 h-4 w-4" />
                      My Settings
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <Button
                      className={`w-full rounded-lg shadow-black ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="-mr-2 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700" `}
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 90 }}
                        exit={{ rotate: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="block h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }}
                        exit={{ rotate: -90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="block h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={`w-[300px] sm:w-[400px] ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}
              >
                <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <div className="relative w-full max-w-[400px] mb-4">
                    <Search
                      className={`absolute left-3 top-3 h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    />
                    <Input
                      type="search"
                      placeholder="Search for people etc..."
                      className={`w-full pl-10 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-black placeholder-gray-500"}`}
                      aria-label="Search"
                    />
                  </div>
                  <Navbarcontent />
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-2">
                      <div className="ml-3">
                        <div
                          className={`text-base font-medium leading-none ${theme === "dark" ? "text-white" : "text-black"}`}
                        >
                          {user?.name}
                        </div>
                        <div
                          className={`text-sm font-medium leading-none ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      <Button
                        className={`w-full rounded-lg shadow-black mt-2 ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
                      >
                        <Link href="/dashboard">My Settings</Link>
                      </Button>
                      <SignOutButton>
                        <Button
                          variant="solid"
                          className={`w-full rounded-lg shadow-black mt-2 ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
                        >
                          Log out
                        </Button>
                      </SignOutButton>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
