import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { axiosClient } from "@/lib/apiClient"
import { Loader2, SearchX } from "lucide-react"
import { toast } from 'sonner'

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { useForm, Controller } from "react-hook-form"
import { HoverCardFormItem } from "@/components/hover-card-form-item"

// 后端账号可用性校验（约定返回 { available: boolean }）
async function checkUserAccount(account: string) {
  try {
    const response = await axiosClient.get(`system/user/checkUserAccount?account=${account}`);
    return response.data.available;
  } catch (error) {
    console.error('检查账号是否存在失败:', error);
    return false;
  }
}

// 防抖相关的变量
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// 带防抖的账号校验函数
async function checkUserAccountWithDebounce(account: string, delay: number = 500): Promise<boolean> {
  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  return new Promise((resolve) => {
    debounceTimer = setTimeout(async () => {
      try {
        // 执行异步校验
        const isAvailable = await checkUserAccount(account);
        resolve(isAvailable);
      } catch (error) {
        resolve(false);
      } finally {
        // 清理定时器引用
        debounceTimer = null;
      }
    }, delay);
  });
}

const RegisterSchema = z.object({
  name: z.string()
    .min(1, { message: "姓名不能为空" }),
  account: z.string()
    .min(1, { message: "账号不能为空" })
    .min(6, { message: "账号长度不能少于6位" })
    .refine(async (value) => {
      // 执行带防抖的异步校验
      const isAvailable = await checkUserAccountWithDebounce(value);
      return isAvailable;
    }, { message: "账号已存在" }),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string()
    .min(8, { message: "密码长度不能少于8位" })
    .regex(/[a-zA-Z]/, { message: "密码必须包含至少一个英文字符" })
    .regex(/[0-9]/, { message: "密码必须包含至少一个数字" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "密码必须包含至少一个特殊符号" }),
  confirmPassword: z.string()
    .min(8, { message: "确认密码长度不能少于8位" })
    .regex(/[a-zA-Z]/, { message: "确认密码必须包含至少一个英文字符" })
    .regex(/[0-9]/, { message: "确认密码必须包含至少一个数字" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "确认密码必须包含至少一个特殊符号" }),
  sex: z.enum(["0", "1", "2"], { message: "请选择性别" }),
}).refine((data) => {
  console.log('密码相同性校验')
  return data.password === data.confirmPassword
}, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
})

type TRegisterSchema = z.infer<typeof RegisterSchema>;

function AddUserFormContent({ onSuccess }: { onSuccess?: () => void }) {

  const { register, handleSubmit, control, formState: { errors, isSubmitting, touchedFields, isSubmitted } } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      account: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      sex: "0",
    },
  });

  const onSubmit = async (data: TRegisterSchema) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const res = await axiosClient.post('/system/user/create', data);
      if (res.status === 201) {
        toast.success("新增成功！");
        onSuccess?.();
      } else {
        console.error("新增失败", res);
      }
    } catch (err: any) {
      console.error("发生异常", err);
    }
  };

  return (
    <>
      <DialogHeader className="">
        <DialogTitle>新增用户</DialogTitle>
        <DialogDescription>
          请完善用户信息
        </DialogDescription>
      </DialogHeader>
      <form className="max-h-[50vh] sm:max-h-[65vh] overflow-y-auto pr-2 py-2">

        <FieldGroup className="!gap-4">

          <Field orientation="grid">
            <FieldLabel htmlFor="name">用户名</FieldLabel>
            <Input id="name" type="text" placeholder="请输入用户名" {...register("name")} />
            {errors.name && (
              <FieldError errors={[errors.name]} className="col-start-2" />
            )}
          </Field>

          <Field orientation="grid">
            <FieldLabel htmlFor="account">账号</FieldLabel>
            <Input id="account" type="text" placeholder="请输入账号" {...register("account")} />
            {errors.account && (
              <FieldError errors={[errors.account]} className="col-start-2" />
            )}
          </Field>

          <Field orientation="grid">
            <FieldLabel htmlFor="email">邮箱</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="请输入邮箱"
              {...register("email")}
            />
            {errors.email && (
              <FieldError errors={[errors.email]} className="col-start-2" />
            )}
          </Field>

          <Field orientation="grid">
            <FieldLabel className="basis-[100px] shrink-0 grow-0">性别</FieldLabel>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} defaultValue="0" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="sex-male" />
                    <FieldLabel htmlFor="sex-male">其他</FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="sex-female" />
                    <FieldLabel htmlFor="sex-female">男</FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="sex-other" />
                    <FieldLabel htmlFor="sex-other">女</FieldLabel>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.sex && (touchedFields.sex || isSubmitted) && (
              <FieldError errors={[errors.sex]} className="col-start-2" />
            )}
          </Field>

          <Field orientation="grid">
            <FieldLabel htmlFor="password">
              <span>密码</span>
              <HoverCardFormItem content="密码长度不能少于8位，必须包含至少一个英文字符、一个数字和一个特殊字符" />
            </FieldLabel>
            <Input id="password" type="password" placeholder="请输入密码" {...register("password")} />
            {errors.password && (touchedFields.password || isSubmitted) && (
              <FieldError errors={[errors.password]} className="col-start-2" />
            )}
          </Field>

          <Field orientation="grid">
            <FieldLabel htmlFor="confirm-password">
              确认密码
            </FieldLabel>
            <Input id="confirm-password" type="password" placeholder="请确认密码" {...register("confirmPassword")} />
            {errors.confirmPassword && (touchedFields.confirmPassword || isSubmitted) && (
              <FieldError errors={[errors.confirmPassword]} className="col-start-2" />
            )}
          </Field>



          {isSubmitting && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">正在创建账户...</span>
              </div>
            </div>
          )}
        </FieldGroup>
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">取消</Button>
        </DialogClose>
        <Button type="submit" onClick={handleSubmit(onSubmit)}>确定</Button>
      </DialogFooter>
    </>
  );
}

export function DialogUserAddForm({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>新增用户</span>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <AddUserFormContent onSuccess={() => { setOpen(false); onCreated?.(); }} />
      </DialogContent>
    </Dialog>
  );
}
