import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { OpenTabsBar } from "@/components/open-tabs-bar";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useSideBarQuery } from "@/lib/authQueries";
import { useEffect, useState } from "react";
import { useInfoQuery } from "@/lib/authQueries";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const cached = localStorage.getItem("theme");
  if (cached === "light" || cached === "dark") return cached;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
};

export default function AppLayout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const { data: sideBarData } = useSideBarQuery(true);
  const { data: userInfo } = useInfoQuery(true);
  console.log(userInfo);
  console.log(sideBarData);
  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <SidebarProvider>
      <AppSidebar sideBarData={sideBarData ?? []} userInfo={userInfo!} />
      <main className="max-w-full flex-1 m-0 sm:my-2 sm:mr-2 rounded-2xl bg-card sm:shadow-md">
        <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-4 h-16 p-3 border-b border-border bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="scale-120 sm:scale-100" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-6 ml-1 sm:ml-0"
          />
          <AppBreadcrumb />
          <div className=" items-center flex-1 flex justify-end gap-3 sm:gap-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="切换主题"
              className="border-0"
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-sm font-medium">
                    SN
                  </AvatarFallback>
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
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
