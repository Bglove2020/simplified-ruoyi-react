import { NestedDataTable } from "@/components/Table/nested-data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SingleSelect } from "@/components/single-select";
import { ArrowUpDown, CirclePlus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { axiosClient } from "@/lib/apiClient";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddDeptDialog from "@/pages/system/deptManage/dialog/add-dept";
import type { DeptNode } from "@/types/tree";
import { DialogDeleteConfirm } from "@/components/Dialog/dialog-delete-confirm";


// 筛选条件
type Filters = {
  name: string;
  status: string;
};


const singleSelectOptions = [
  { label: "启用", value: "1" },
  { label: "禁用", value: "0" },
];

// 将 filters 转换为 { id, value } 对象数组，这个类型是tanstack要求的
// 对于默认的筛选器函数，当传入的value是空字符串时，不进行筛选。
// 一定注意，这里的id，指的是columns中定义的列的id或key。
const extractFilterEntries = (filters: Filters) => {
  return Object.entries(filters).map(([key, val]) => ({
    id: key,
    value: val,
  }));
};

export default function DeptManage() {

  const [data, setData] = useState<DeptNode[]>([]);
  const [openAddDeptDialog, setOpenAddDeptDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [activeDept, setActiveDept] = useState<DeptNode | undefined>(undefined);
  const [isCreate, setIsCreate] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    status: "",
  });

  const loadDepts = useCallback(() => {
    axiosClient
      .get<{data: DeptNode[]}>("/system/dept/list")
      .then((res) => { setData(res.data.data); })
  }, [])

  const deleteDept = useCallback(async () => {
    return await axiosClient.delete(`/system/dept/delete?publicId=${activeDept?.publicId}`);
  }, [activeDept]);

  useEffect(() => {
    loadDepts();
  }, [loadDepts]);

  const columns: ColumnDef<DeptNode>[] = [
    {
      accessorKey: "orderNum",
      header: "顺序",
      cell: ({ row }) => (
        row.original.sortOrder
      ),
    },
  
    {
      accessorKey: "leaderEmail",
      header: "负责人邮箱",
      cell: ({ row }) => (
        row.original.leaderEmail
      ),
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => (
        <Switch checked={row.original.status == "1"} onCheckedChange={(checked) => {
          axiosClient.post("/system/dept/update", {
            publicId: row.original.publicId,
            status: checked ? "1" : "0",
          }).then((res) => {
              if(res.data.success){
                toast.success(res.data.msg);
                loadDepts();
              }else{
                toast.error(res.data.msg);
              }
            }).catch((err) => {
              toast.error(err.response.data.msg);
            });
        }} />
      ),
    },
    {
      accessorKey: "actions",
      header: "操作",
      cell: ({ row }) => {
        return(
          <>
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
                  onClick={() => {setActiveDept(row.original); setIsCreate(true);setOpenAddDeptDialog(true);}}
                >
                  <span className="grow">添加子部门</span>
                  <CirclePlus />
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator className="my-1" /> */}
                <DropdownMenuItem
                  className="cursor-pointer gap-8"
                  onClick={() => {setActiveDept(row.original); setIsCreate(false);setOpenAddDeptDialog(true);}}
                >
                  <span className="grow">编辑部门</span>
                  <Pencil  />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  className="cursor-pointer gap-8"
                  onClick={() => {
                    setActiveDept(row.original);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <span className="grow text-red-500">删除</span>
                  <Trash2 color="#FB2C36" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      }
    },
  ]

  return (
    <div className="space-y-4 px-8 py-6">
      {/* 筛选区域 */}
      <div className="rounded-md space-y-3 flex flex-col items-start gap-2 sm:gap-4 sm:flex-row sm:flex-wrap">
        {/* 搜索框 */}
        <div className="w-full max-w-[300px] flex items-center gap-2">
          <Input
            id="search"
            placeholder="输入部门名称"
            value={filters.name}
            onChange={(e) =>
              setFilters((f) => ({ ...f, name: e.target.value }))
            }
            className="w-full py-2 text-sm"
          />
        </div>
        {/* 单选（DropdownMenu + radio） */}
        <div className="w-full max-w-[300px] flex items-center gap-2">
          <SingleSelect
            className="w-full"
            placeholder="请选择状态"
            options={singleSelectOptions}
            value={filters.status}
            label="状态"
            onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2">
        <Button variant="outline" onClick={() => {setOpenAddDeptDialog(true); setIsCreate(true); setActiveDept(undefined);}}>
            <span>新增部门</span>
            <CirclePlus />
          </Button>
        
        <Button variant="outline">
          <span>展开 / 折叠</span>
          <ArrowUpDown />
        </Button>
      </div>

      <div className="w-full">
        <NestedDataTable
          firstColumnHeaderName="部门名称"
          firstColumnKey="name"
          data={data}
          columns={columns}
          filterEntries={extractFilterEntries(filters)}
          getRowId={(r) => r.publicId}
          getSubRows={(r) => {
            const deptNode = r as DeptNode;
            return (deptNode.children as DeptNode[])?.sort((a, b) => a.sortOrder - b.sortOrder);
          }}
        />
      </div>
      {
        openAddDeptDialog&&<AddDeptDialog open={openAddDeptDialog} onOpenChange={setOpenAddDeptDialog} onSuccess={loadDepts} activeDept={activeDept} isCreate={isCreate}/>
      }
      {
        openDeleteDialog && <DialogDeleteConfirm 
        open={openDeleteDialog} 
        onOpenChange={setOpenDeleteDialog} 
        onSuccess={()=>{setOpenDeleteDialog(false); loadDepts(); setActiveDept(undefined);}} 
        deleteApi={deleteDept} 
        title="删除部门"
        >
            <div className="text-sm mb-2">确定要删除
              <span className="bg-primary/10 border border-primary px-3 py-1 rounded-md mx-1">{activeDept?.name}</span>吗？
            </div>
            <div className="text-sm text-gray-500">注意：删除部门后，该部门下的所有子部门和用户将同时删除。</div>
        </DialogDeleteConfirm>
      }

    </div>
  );
}
