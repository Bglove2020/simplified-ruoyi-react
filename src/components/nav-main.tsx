import { ChevronRight, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  const { pathname } = useLocation();
  const isMatch = (url: string) => pathname.includes(url);
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const groupActive = isMatch(item.url) || (item.items?.some((s) => isMatch(s.url)) ?? false);
          return (
          <Collapsible key={item.title + pathname} asChild defaultOpen={groupActive}>
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <div className="group">
                      <SidebarMenuButton asChild tooltip={item.title} isActive={groupActive}>
                        <a href="#" className="gap-4">
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction className="transition-transform group-data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="pt-2 gap-2">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isMatch(subItem.url)}>
                            <a href={subItem.url} className="gap-4">
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                <SidebarMenuButton asChild tooltip={item.title} isActive={isMatch(item.url)}>
                  <a href={item.url} className="gap-4">
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );})}
      </SidebarMenu>
    </SidebarGroup>
  );
}
