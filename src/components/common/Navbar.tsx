"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Settings2, LogOut, Menu, X, ChevronDown } from "lucide-react";
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
import AddFriendDialog from "./AddFriendDialog";
import NavbarConvo from "./NavbarChat";
import NavbarAnonymous from "./NavAnony";
import Notification from "../notification/page";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useQuery(api.users.get);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b ${
        theme === "dark" ? "border-gray-800" : "border-gray-300"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold md:text-3xl logo bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                VYBE
              </h1>
            </Link>
          </motion.div>

          {/* Search & Nav Items (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              className="relative w-64 lg:w-80"
              whileHover={{ scale: 1.02 }}
            >
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <Input
                type="search"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-black placeholder-gray-500"
                }`}
                aria-label="Search"
              />
            </motion.div>
            <Navbarcontent />
            <TButton />
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <Avatar
                    className={`h-8 w-8 rounded-full border-2 ${
                      theme === "dark" ? "border-blue-500" : "border-blue-600"
                    }`}
                    src={user?.imageUrl}
                    alt={user?.username}
                  />
                  <span className="hidden lg:inline-block font-medium">
                    {user?.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-56 p-2 ${
                  theme === "dark"
                    ? "bg-gray-900 border border-gray-700 text-gray-300"
                    : "bg-white border border-gray-200 text-black"
                }`}
              >
                <DropdownMenuLabel>
                  <p className="font-semibold">Signed in as</p>
                  <p
                    className={`font-semibold ${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className={`flex items-center px-2 py-2 text-sm rounded-md ${
                      theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    My Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <button
                      className={`flex items-center w-full px-2 py-2 text-sm rounded-md ${
                        theme === "dark"
                          ? "hover:bg-gray-800 text-red-400"
                          : "hover:bg-gray-100 text-red-600"
                      }`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center justify-center p-2 rounded-md ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-white hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
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
                className={`w-full sm:w-80 ${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-black"
                }`}
              >
                <nav className="flex flex-col h-full">
                <div className="flex flex-row p-2 space-evenly">
                      <TButton />
                      <Notification/>
                    </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6">
                      <div className="flex items-center mb-6">
                        <Avatar
                          className={`h-10 w-10 rounded-full border-2 ${
                            theme === "dark"
                              ? "border-blue-500"
                              : "border-blue-600"
                          }`}
                          src={user?.imageUrl}
                          alt={user?.username}
                        />
                        <div className="ml-3">
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-sm text-gray-500">
                            {user?.email}
                          </div>
                        </div>
                      </div>
                      <div className="relative mb-6">
                        <Search
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className={`w-full pl-10 pr-4 py-2 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            theme === "dark"
                              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-black placeholder-gray-500"
                          }`}
                          aria-label="Search"
                        />
                      </div>
                      <div className="flex flex-row gap-2 align-middle items-center justify-between">
                        <AddFriendDialog />
                        <NavbarConvo />
                        <NavbarAnonymous />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/dashboard"
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Settings2 className="mr-3 h-5 w-5" />
                      My Settings
                    </Link>
                    <SignOutButton>
                      <button
                        className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium rounded-md ${
                          theme === "dark"
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log out
                      </button>
                    </SignOutButton>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
