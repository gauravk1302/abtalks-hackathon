"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "../hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();
  const avatarSrc = user?.image || undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none select-none">
        <div
          className={cn(
            "relative rounded-full ring-2 ring-white/10 hover:ring-primary/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
          )}
        >
          {/* Avatar Trigger Badge */}
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 border border-white/10 bg-[#14131C] shadow-lg">
            <AvatarImage
              src={avatarSrc}
              alt={user?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#14131C] text-white font-bold font-[family-name:var(--font-rubik)]">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      {/* Dark Theme Dropdown Container */}
      <DropdownMenuContent
        className="w-64 sm:w-72 mr-2 sm:mr-4 p-2 shadow-2xl rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#0F0E17]/95 backdrop-blur-xl font-[family-name:var(--font-rubik)] text-white"
        align="end"
      >
        {/* User Details Header Card */}
        <div className="p-3 rounded-xl sm:rounded-2xl bg-[#14131C] border border-white/5 cursor-default mb-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 border border-white/10">
              <AvatarImage
                src={avatarSrc}
                alt={user?.name || "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-white/10 text-white font-bold">
                <User className="h-5 w-5 text-gray-300" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-0.5 overflow-hidden">
              <p className="text-xs sm:text-sm font-extrabold leading-tight truncate text-white font-[family-name:var(--font-libre-franklin)]">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] sm:text-xs leading-tight text-gray-400 truncate font-[family-name:var(--font-libre-franklin)]">
                {user?.email || "No email linked"}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-white/10" />

        {/* Logout Button */}
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-300 hover:text-red-300 focus:bg-red-500/10 hover:bg-red-500/10 py-2.5 px-3 rounded-xl transition-all text-xs sm:text-sm font-medium flex items-center gap-2.5 font-[family-name:var(--font-libre-franklin)]">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
