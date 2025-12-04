import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { axiosClient } from "./apiClient";

export type DictType = {
  publicId: string;
  name: string;
  type: string;
  sortOrder: number;
  status: string;
  createTime?: string;
  updateTime?: string;
};

export type DictData = {
  publicId: string;
  label: string;
  value: string;
  sortOrder: number;
  status: string;
  cssClass?: string;
  listClass?: string;
};

async function fetchDictTypes(): Promise<DictType[]> {
  const res = await axiosClient.get<{ data: DictType[] }>("/system/dict/list");
  return res.data.data;
}

async function fetchDictDetail(publicId: string): Promise<DictType> {
  const res = await axiosClient.get<{ data: DictType }>(
    `/system/dict/${publicId}`
  );
  return res.data.data;
}

async function fetchDictData(
  dictPublicId: string,
  dictType: string
): Promise<DictData[]> {
  const res = await axiosClient.get<{ data: DictData[] }>(
    "/system/dict/data/list",
    {
      params: { publicId: dictPublicId, type: dictType },
    }
  );
  return res.data.data;
}

export function useDictTypesQuery(enabled = true): UseQueryResult<DictType[]> {
  return useQuery({
    queryKey: ["dict-types"],
    queryFn: fetchDictTypes,
    enabled,
    staleTime: 60_000,
  });
}

export function useDictDetailQuery(
  publicId: string,
  enabled = true
): UseQueryResult<DictType> {
  return useQuery({
    queryKey: ["dict-detail", publicId],
    queryFn: () => fetchDictDetail(publicId),
    enabled: enabled && Boolean(publicId),
    staleTime: 60_000,
  });
}

export function useDictDataQuery(
  params: { publicId: string; type: string } | null,
  enabled = true
): UseQueryResult<DictData[]> {
  return useQuery({
    queryKey: ["dict-data", params?.publicId, params?.type],
    queryFn: () => fetchDictData(params!.publicId, params!.type),
    enabled: enabled && Boolean(params?.publicId && params?.type),
    staleTime: 60_000,
  });
}
