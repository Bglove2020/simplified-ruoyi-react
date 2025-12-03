import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./apiClient";
import type { RouterItem } from "@/types/router";

export type UserInfo = {
  user: {
    publicId: string;
    name: string;
    account: string;
    email: string;
    avatar: string;
    sex: string;
    status: string;
  };
  roles: string[];
  permissions: string[];
};

export type SideBarItem = {
  title: string;
  url: string;
  frame: boolean;
  children: SideBarItem[];
};

async function fetchInfo(): Promise<UserInfo> {
  const res = await axiosClient.get<{ data: UserInfo }>("/getInfo");
  return res.data.data;
}

async function fetchRouters(): Promise<RouterItem[]> {
  const res = await axiosClient.get<{ data: RouterItem[] }>("/getRouters");
  return res.data.data;
}

async function fetchSideBar(): Promise<SideBarItem[]> {
  const res = await axiosClient.get<{ data: SideBarItem[] }>(
    "/getSideBarMenus"
  );
  return res.data.data;
}

export function useInfoQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "info"],
    queryFn: fetchInfo,
    enabled,
    staleTime: 30_000000,
  });
}

export function useRoutersQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "routers"],
    queryFn: fetchRouters,
    enabled,
    staleTime: 30_000000,
  });
}

export function useSideBarQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "sideBar"],
    queryFn: fetchSideBar,
    enabled,
    staleTime: 30_000000,
  });
}
