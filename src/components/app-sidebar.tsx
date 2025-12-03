"use client"

import * as React from "react"
import { Bot, Command, Building2, Menu, SquareTerminal, User, BookUser } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type SideBarItem } from "@/lib/authQueries"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "首页",
      url: "/Dashboard",
      // icon: SquareTerminal,
      items: [],
    },
    {
      title: "系统管理",
      url: "/system/user-management",
      icon: Bot,
      items: [
        {
          title: "用户管理",
          // icon: User,
          url: "/system/user-management",
        },
        {
          title: "院系管理",
          // icon: Building2,
          url: "/system/dept-management",
        },
        {
          title: "菜单管理",
          // icon: Menu,
          url: "/system/menu-management",
        },
        {
          title: "角色管理",
          icon: BookUser,
          url: "/system/role-management",
        }
      ],
    },
  ],
}

export function AppSidebar({ sideBarData }: { sideBarData: SideBarItem[] }) {
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
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
