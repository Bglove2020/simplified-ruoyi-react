"use client";

import * as React from "react";
import {
  Bot,
  Command,
  Building2,
  Menu,
  SquareTerminal,
  User,
  BookUser,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type SideBarItem, type UserInfo } from "@/lib/authQueries";

export function AppSidebar({
  sideBarData,
  userInfo,
}: {
  sideBarData: SideBarItem[];
  userInfo: UserInfo;
}) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sideBarData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
