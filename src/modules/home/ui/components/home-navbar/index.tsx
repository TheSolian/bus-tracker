import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BusFrontIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b px-2 pr-5">
      <div className="items- flex w-full justify-between gap-4">
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger />
          <Link href="/">
            <div className="flex items-center gap-1 p-4">
              <BusFrontIcon className="text-primary size-6" />
              <p className="text-xl tracking-tight">Bus Tracker</p>
            </div>
          </Link>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
