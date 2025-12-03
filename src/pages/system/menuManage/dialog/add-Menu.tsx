import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { TreeSelect } from "@/components/tree-select";
import { axiosClient } from "@/lib/apiClient";
import { useEffect, useMemo, useState } from "react";
// import { SingleSelect } from "../../../../components/single-select";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { MenuNode } from "@/types/tree";
import DialogLoading from "@/components/dialog-loading";

const AddDeptSchema = z
  .object({
    menuType: z.enum(["M", "C", "F"], { message: "菜单类型不能为空" }),
    name: z.string().min(1, { message: "菜单名称不能为空" }),
    isFrame: z
      .enum(["0", "1"], { message: "是否外链不能为空" })
      .optional()
      .or(z.literal("")),
    visible: z
      .enum(["0", "1"], { message: "是否可见不能为空" })
      .optional()
      .or(z.literal("")),
    parentPublicId: z
      .string()
      .uuid({ message: "父菜单必须是UUID格式" })
      .optional()
      .or(z.literal("")),
    sortOrder: z.number().int({ message: "排序号必须是整数" }),
    status: z.enum(["0", "1"], { message: "菜单状态不能为空" }),
    path: z.string().optional(),
    perms: z.string().optional(),
  })
  .refine(
    (data) => {
      const noParent = !data.parentPublicId || data.parentPublicId === "";
      // 只有类型为 F 时，必须选择父菜单
      if (["F"].includes(data.menuType) && noParent) {
        return false;
      }
      return true;
    },
    {
      message: "请选择父菜单",
      path: ["parentPublicId"],
    }
  );

type TAddDeptSchema = z.infer<typeof AddDeptSchema>;

export default function AddDeptDialog({
  open,
  onOpenChange,
  onSuccess,
  activeData,
  isCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  activeData?: MenuNode;
  isCreate?: boolean;
}) {
  const [menuTree, setMenuTree] = useState([]);

  // 加载部门树数据
  useEffect(() => {
    axiosClient
      .get("/system/menu/list")
      .then((res) => {
        setMenuTree(res.data.data);
      })
      .catch((err) => {
        console.error("加载菜单列表失败:", err);
      });
  }, []);

  const defaultValues = useMemo(() => {
    return {
      menuType: isCreate ? "M" : activeData?.menuType || "M",
      isFrame: isCreate ? "0" : activeData?.isFrame || "0",
      visible: isCreate ? "1" : activeData?.visible || "1",
      name: isCreate ? "" : activeData?.name || "",
      parentPublicId: isCreate ? activeData?.publicId : undefined,
      sortOrder: isCreate ? 0 : activeData?.sortOrder || 0,
      status: isCreate ? "1" : activeData?.status || "1",
      path: isCreate ? undefined : activeData?.path || undefined,
      perms: isCreate ? undefined : activeData?.perms || undefined,
    };
  }, [isCreate, activeData]);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TAddDeptSchema>({
    resolver: zodResolver(AddDeptSchema),
    mode: "onChange",
    // shouldUnregister: true,
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: TAddDeptSchema) => {
    console.log("onSubmit data:", data);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let sendData = {};
      if (isCreate) {
        sendData = data;
      } else {
        if (data.menuType === "M") {
          sendData = {
            publicId: activeData?.publicId,
            name: data.name,
            sortOrder: data.sortOrder,
            status: data.status,
            path: data.path,
            visible: data.visible,
            isFrame: data.isFrame,
          };
        } else if (data.menuType === "C") {
          sendData = {
            publicId: activeData?.publicId,
            name: data.name,
            sortOrder: data.sortOrder,
            status: data.status,
            path: data.path,
            perms: data.perms,
            visible: data.visible,
            isFrame: data.isFrame,
          };
        } else if (data.menuType === "F") {
          sendData = {
            publicId: activeData?.publicId,
            name: data.name,
            sortOrder: data.sortOrder,
            status: data.status,
            perms: data.perms,
          };
        }
      }
      console.log("sendData:", sendData);
      const res = await axiosClient.post(
        isCreate ? "/system/menu/create" : "/system/menu/update",
        sendData
      );
      if (res.data.code === 200) {
        toast.success(res.data.msg);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res.data.msg);
      }
    } catch (err: any) {
      console.error("发生异常", err);
    }
  };

  const menuType = watch("menuType");
  const isFrame = watch("isFrame");

  // 当 menuType 切换时，重置表单字段为默认值（仅在创建模式下）
  useEffect(() => {
    console.log("reset defaultValues:", defaultValues);
    reset({ ...defaultValues, menuType, isFrame });
  }, [menuType, isFrame, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isCreate ? "新增菜单" : "编辑菜单"}</DialogTitle>
        </DialogHeader>
        <form className="max-h-[50vh sm:max-h-[65vh] overflow-y-auto pr-2 py-2">
          <FieldGroup className="!gap-4">
            {isCreate && (
              <Field orientation="grid">
                <FieldLabel htmlFor="menuType">菜单类型</FieldLabel>
                <Controller
                  name="menuType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="menuType-M" />
                        <label
                          htmlFor="menuType-M"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          目录
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="C" id="menuType-C" />
                        <label
                          htmlFor="menuType-C"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          菜单
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="menuType-F" />
                        <label
                          htmlFor="menuType-F"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          按钮
                        </label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.menuType && (
                  <FieldError
                    errors={[errors.menuType]}
                    className="col-start-2"
                  />
                )}
              </Field>
            )}

            {menuType !== "M" && isCreate && (
              <Field orientation="grid">
                <FieldLabel htmlFor="parentPublicId">父菜单</FieldLabel>
                <Controller
                  name="parentPublicId"
                  control={control}
                  render={({ field }) => (
                    <TreeSelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="请选择父菜单"
                      data={menuTree}
                      allowSelectParent={true}
                      disabled={!isCreate}
                    />
                  )}
                />
                {errors.parentPublicId && (
                  <FieldError
                    errors={[errors.parentPublicId]}
                    className="col-start-2"
                  />
                )}
              </Field>
            )}

            <Field orientation="grid">
              <FieldLabel htmlFor="name">菜单名称</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="请输入菜单名称"
                {...register("name")}
              />
              {errors.name && (
                <FieldError errors={[errors.name]} className="col-start-2" />
              )}
            </Field>

            {(menuType === "C" || menuType === "F") && (
              <Field orientation="grid">
                <FieldLabel htmlFor="perms">权限字符</FieldLabel>
                <Input
                  id="perms"
                  type="text"
                  placeholder="请输入权限字符"
                  {...register("perms")}
                />
                {errors.perms && (
                  <FieldError errors={[errors.perms]} className="col-start-2" />
                )}
              </Field>
            )}

            <Field orientation="grid">
              <FieldLabel htmlFor="sortOrder">排序号</FieldLabel>
              <Input
                id="sortOrder"
                type="number"
                placeholder="请输入排序号"
                {...register("sortOrder", { valueAsNumber: true })}
              />
              {errors.sortOrder && (
                <FieldError
                  errors={[errors.sortOrder]}
                  className="col-start-2"
                />
              )}
            </Field>

            {menuType !== "F" && (
              <Field orientation="grid">
                <FieldLabel htmlFor="isFrame">是否为外链</FieldLabel>
                <Controller
                  name="isFrame"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-5"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="isFrame-1" />
                        <label
                          htmlFor="isFrame-1"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          是
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="isFrame-0" />
                        <label
                          htmlFor="isFrame-0"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          否
                        </label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.isFrame && (
                  <FieldError
                    errors={[errors.isFrame]}
                    className="col-start-2"
                  />
                )}
              </Field>
            )}

            {((menuType === "M" && isFrame === "1") || menuType == "C") && (
              <Field orientation="grid">
                <FieldLabel htmlFor="path">路由地址</FieldLabel>
                <Input
                  id="path"
                  type="text"
                  placeholder="请输入路由地址"
                  {...register("path")}
                />
              </Field>
            )}

            {menuType !== "F" && (
              <Field orientation="grid">
                <FieldLabel htmlFor="visible">是否可见</FieldLabel>
                <Controller
                  name="visible"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-5"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="visible-1" />
                        <label
                          htmlFor="visible-1"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          是
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="visible-0" />
                        <label
                          htmlFor="visible-0"
                          className="text-sm font-medium min-w-8 sm:min-w-10"
                        >
                          否
                        </label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.visible && (
                  <FieldError
                    errors={[errors.visible]}
                    className="col-start-2"
                  />
                )}
              </Field>
            )}

            <Field orientation="grid">
              <FieldLabel>菜单状态</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-5"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="status-normal" />
                      <label
                        htmlFor="status-normal"
                        className="text-sm font-medium min-w-8 sm:min-w-10"
                      >
                        正常
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="status-disable" />
                      <label
                        htmlFor="status-disable"
                        className="text-sm font-medium min-w-8 sm:min-w-10"
                      >
                        停用
                      </label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.status && (
                <FieldError errors={[errors.status]} className="col-start-2" />
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={() => {
              console.log(errors);
              handleSubmit(onSubmit as any)();
            }}
          >
            确定
          </Button>
        </DialogFooter>
        {isSubmitting && (
          <DialogLoading
            title={isCreate ? "正在创建菜单..." : "正在编辑菜单..."}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
