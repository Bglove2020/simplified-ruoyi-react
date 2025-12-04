import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/lib/apiClient";
import {
  useDictDataQuery,
  useDictDetailQuery,
  type DictData,
  type DictType,
} from "@/lib/dictQueries";
import DictDataDialog from "./dialog/dict-data-dialog";
import { DialogDeleteConfirm } from "@/components/Dialog/dialog-delete-confirm";
import { SingleSelect } from "@/components/single-select";

type DataFilters = {
  status: string;
};

const statusOptions = [
  { label: "正常", value: "1" },
  { label: "停用", value: "0" },
];

const extractFilterEntries = (filters: Record<string, unknown>) =>
  Object.entries(filters).map(([key, val]) => ({
    id: key,
    value: val,
  }));

export default function DictDataPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dictName = searchParams.get("name") ?? "";
  const dictType = searchParams.get("type") ?? "";
  const queryClient = useQueryClient();

  const [dataFilters, setDataFilters] = useState<DataFilters>({
    status: "",
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dictDataList, setDictDataList] = useState<DictData[]>([]);
  const [dataDialogOpen, setDataDialogOpen] = useState(false);
  const [activeData, setActiveData] = useState<DictData | null>(null);
  const [dataIsCreate, setDataIsCreate] = useState(true);
  const [deleteDataDialogOpen, setDeleteDataDialogOpen] = useState(false);

  useEffect(() => {
    loadDictData();
  }, []);

  const loadDictData = useCallback(() => {
    axiosClient
      .get<{ data: DictData[] }>("/system/dict/data/list", {
        params: { type: dictType },
      })
      .then((res) => {
        setDictDataList(res.data.data);
      });
  }, []);

  const updateDataStatus = (publicId: string, status: boolean) => {
    axiosClient
      .post("/system/dict/data/update", {
        publicId,
        status: status ? "1" : "0",
      })
      .then((res) => {
        if (res.data.code === 200) {
          toast.success(res.data.msg);
          loadDictData();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => toast.error(String(err)));
  };

  const deleteDictData = useCallback(async () => {
    return axiosClient.delete(
      `/system/dict/data/delete/${activeData!.publicId}`
    );
  }, [activeData]);

  const dataColumns: ColumnDef<DictData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="mr-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "label",
      header: "字典标签",
      cell: ({ row }) => row.getValue("label"),
    },
    {
      accessorKey: "value",
      header: "字典键值",
      cell: ({ row }) => row.getValue("value"),
    },
    {
      accessorKey: "sortOrder",
      header: "显示顺序",
      cell: ({ row }) => row.getValue("sortOrder"),
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => (
        <Switch
          checked={row.getValue("status") === "1"}
          onCheckedChange={(checked) =>
            updateDataStatus(row.original.publicId, checked)
          }
        />
      ),
      filterFn: (row, value, filterValue) => {
        if (!filterValue) return true;
        return row.getValue("status") === filterValue;
      },
    },
    {
      id: "actions",
      header: "操作",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer gap-8"
              onClick={() => {
                setActiveData(row.original);
                setDataIsCreate(false);
                setDataDialogOpen(true);
              }}
            >
              <span className="grow">编辑数据</span>
              <Pencil />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              className="cursor-pointer gap-8"
              onClick={() => {
                setActiveData(row.original);
                setDeleteDataDialogOpen(true);
              }}
            >
              <span className="grow text-destructive">删除</span>
              <Trash2 className="text-destructive" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4 px-8 py-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 relative">
          {/* <Button
            className="absolute left-[-42px]"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
          </Button> */}
          <div className="text-xl font-semibold flex-1">
            {dictName || "未命名字典"}
          </div>

          <div></div>
        </div>
      </div>

      <div className="rounded-md space-y-3 flex flex-col items-start gap-2 sm:gap-4 sm:flex-row sm:flex-wrap">
        <div className="w-full max-w-[260px] flex items-center gap-2">
          <SingleSelect
            className="w-full"
            placeholder="请选择状态"
            options={statusOptions}
            value={dataFilters.status}
            label="状态"
            onChange={(v) => setDataFilters((f) => ({ ...f, status: v }))}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setDataIsCreate(true);
            setActiveData(null);
            setDataDialogOpen(true);
          }}
        >
          <span>新增字典数据</span>
          <Plus />
        </Button>
        <Button variant="outline" onClick={loadDictData}>
          <span>刷新</span>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <DataTable
        filters={extractFilterEntries(dataFilters)}
        data={dictDataList}
        columns={dataColumns}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {dataDialogOpen && (
        <DictDataDialog
          open={dataDialogOpen}
          onOpenChange={setDataDialogOpen}
          onSuccess={() => {
            loadDictData();
            setDataDialogOpen(false);
            setActiveData(null);
          }}
          isCreate={dataIsCreate}
          activeData={activeData}
          dictType={dictType}
        />
      )}

      {activeData && (
        <DialogDeleteConfirm
          open={deleteDataDialogOpen}
          onOpenChange={setDeleteDataDialogOpen}
          deleteApi={deleteDictData}
          onSuccess={() => {
            loadDictData();
            setDeleteDataDialogOpen(false);
            setActiveData(null);
          }}
          title="删除字典数据"
        >
          <span className="text-sm mb-2 block">
            确定要删除字典数据
            <span className="bg-primary/10 border border-primary px-3 py-1 rounded-md mx-1">
              {activeData.label}
            </span>
            吗？
          </span>
        </DialogDeleteConfirm>
      )}
    </div>
  );
}
