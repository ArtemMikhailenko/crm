"use client";

import { Bell, Calendar, Search, Settings } from "lucide-react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-[48px] bg-white p-3 h-[60px] border border-[#eef1f4] shadow-sm",
        className
      )}
    >
      {/* Left: Brand logo */}
      <div className="flex items-center gap-3 pl-3">
        <Image
          src="/logo.svg"
          alt="Brand"
          width={78}
          height={30}
          className="h-[30px] w-auto"
          priority
        />
      </div>

      {/* Right: Search + actions */}
      <div className="flex items-center gap-4 pr-1">
        {/* Search */}
        <div className="relative flex h-9 w-[240px] items-center rounded-full border border-[#ccd5dc] px-4">
          <Search className="mr-2 h-4 w-4 text-[#81838f]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm placeholder-[#81838f] focus:outline-none"
          />
        </div>

        {/* Action buttons */}
        <IconCircle>
          <Settings className="h-5 w-5 text-slate-700" />
        </IconCircle>
        <IconCircle>
          <Calendar className="h-5 w-5 text-slate-700" />
        </IconCircle>
        <IconCircle>
          <Bell className="h-5 w-5 text-slate-700" />
        </IconCircle>

        {/* Avatar */}
        <Avatar className="h-9 w-9 ring-1 ring-white/80">
          <AvatarImage src="https://i.pravatar.cc/72?img=12" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ccd5dc] bg-white">
      {children}
    </div>
  );
}
