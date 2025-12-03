import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigate, Link } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { axiosClient } from "@/lib/apiClient"
import { Loader2 } from "lucide-react"
import { toast } from 'sonner'
import { HoverCardFormItem } from "../hover-card-form-item"

async function checkUserAccount(account: string) {
  try {
    const response = await axiosClient.get(`system/user/checkUserAccount?account=${account}`);
    return response.data.data.available;
  } catch (error) {
    console.error('检查账号是否存在失败:', error);
    return false;
  }
}

// 用于缓存已校验过的账号，避免重复校验
let lastValidatedAccount = "";
let lastValidationResult = true;

const RegisterSchema = z.object({
  name: z.string()
    .min(1, { message: "姓名不能为空" }),
  account: z.string()
    .min(1, { message: "账号不能为空" })
    .min(5, { message: "账号长度至少为5位" })
    .refine(async (value) => {
      // 如果值没变，直接返回上次的结果，避免重复请求
      if (value === lastValidatedAccount) {
        return lastValidationResult;
      }
      
      // 执行异步校验
      const isAvailable = await checkUserAccount(value);
      
      // 缓存结果
      lastValidatedAccount = value;
      lastValidationResult = isAvailable;
      
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

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      account: "",
      email: "",
      password: "",
      confirmPassword: "",
      sex: "1",
    },
  });

  const onSubmit = async (data: TRegisterSchema) => {
    try {
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 实际的注册 API 调用
      const res = await axiosClient.post('/auth/register', data);
      console.log(res)
      if (res.status === 201) {
        // 注册成功，跳转到登录页
        console.log('注册成功，开始跳转页面！')
        navigate('../login');
        toast.success("注册成功，请登录！");
      } else {
        console.error("注册失败",res)
        // toast.error(res.data.message || '注册失败');
      }
    } catch (err: any) {
      console.error("发生异常",err)
      // toast.error(err?.response?.data?.message || err.message || '网络异常,请稍后再试');
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="text-center">注册账号</CardTitle>
        <CardDescription className="text-center">
          请输入您的个人信息以创建账号
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="!gap-4">

            <Field className="!gap-2">
              <FieldLabel htmlFor="name">用户名</FieldLabel>
              <Input id="name" type="text" placeholder="请输入用户名" {...register("name")} />
              {errors.name && <FieldDescription className="text-destructive text-left mt-0">{errors.name.message}</FieldDescription>}
            </Field>

            <Field className="!gap-2">
              <FieldLabel htmlFor="account">
                <span>账号</span>
                <HoverCardFormItem content="账号长度最少6位，不能重复" />
              </FieldLabel>
              <Input id="account" type="text" placeholder="请输入账号" {...register("account")} />
              {errors.account && <FieldDescription className="text-destructive text-left mt-0">{errors.account.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">邮箱</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                {...register("email")}
              />
              {errors.email && <FieldDescription className="text-destructive text-left mt-0">{errors.email.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                <span>密码</span>
                <HoverCardFormItem content="密码长度不能少于8位，必须包含至少一个英文字符、一个数字和一个特殊字符" />
              </FieldLabel>
              <Input id="password" type="password" placeholder="请输入密码" {...register("password")} />
              {errors.password && <FieldDescription className="text-destructive text-left mt-0">{errors.password.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                确认密码
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="请确认密码" {...register("confirmPassword")} />
              {errors.confirmPassword && <FieldDescription className="text-destructive text-left mt-0">{errors.confirmPassword.message}</FieldDescription>}
            </Field>

            <Field>
              <FieldLabel htmlFor="sex">性别</FieldLabel>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} defaultValue="1" className="flex space-x-4">
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
              {errors.sex && <FieldDescription className="text-destructive text-left mt-0">{errors.sex.message}</FieldDescription>} 
            </Field>

              {/* Loading overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">正在创建账户...</span>
                  </div>
                </div>
              )}

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      注册中...
                    </>
                  ) : (
                    "注册"
                  )}
                </Button>
                <FieldDescription className="px-6 text-center">
                  已有账号？ <Link to="/auth/login" className="underline">登录</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
