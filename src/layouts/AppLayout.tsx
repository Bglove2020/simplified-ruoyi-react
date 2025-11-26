import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { OpenTabsBar } from "@/components/open-tabs-bar"
import { Separator } from "@/components/ui/separator"
import { Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun } from 'lucide-react';

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="max-w-full flex-1 m-0 sm:my-2 sm:mr-2 rounded-2xl bg-white sm:shadow-md ">
        <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-4 h-16 p-3 border-b border-border bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="scale-120 sm:scale-100" />
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-6 ml-1 sm:ml-0" />
          <AppBreadcrumb />
          <div className="flex-1 items-center flex justify-end gap-3 sm:gap-4">
            <Button variant="outline" size="icon" aria-label="Submit" className="border-0">
              <Sun />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-sm font-medium">SN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* <Separator orientation="horizontal" className="data-[orientation=horizontal]:w-full h-1 bg-border" /> */}
        {/* <OpenTabsBar /> */}
        <Outlet />
      </main>
    </SidebarProvider>
  )
}