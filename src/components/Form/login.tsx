import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { axiosClient, getAccessToken, setAccessToken } from "@/lib/apiClient"
import { useNavigate, Link } from "react-router-dom" // 引入 useNavigate 和 Link
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { userAccountSchema, passwordSchema } from "@/lib/validation"
import { useQueryClient } from "@tanstack/react-query"

// 定义数据校验类
const LoginSchema = z.object({
  // 必填，且必須是有效的 email 格式
  account: userAccountSchema(),
  // 必填，長度至少為 8
  password: passwordSchema(),
});

// 提取数据校验类型
type LoginSchemaType = z.infer<typeof LoginSchema>;

export function LoginForm() {

  // 初始化 useNavigate
  const navigate = useNavigate() 
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: {
      account: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {

    try {
      const res = await axiosClient.post('/auth/login', {account: data.account, password: data.password})
      // console.log(res)
      if (res.status === 201) {
        // Access Token 存入内存，Refresh Token 由服务端以 HttpOnly Cookie 设置
        const token = res.data.data.accessToken
        // console.log('token',token)
        if (token) {
          setAccessToken(token)
        }
        // console.log('等待5秒')
        // await new Promise(resolve => setTimeout(resolve, 5000))
        // console.log(getAccessToken())
        // 强制刷新用户信息、路由和侧边栏数据
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["auth", "info"] }),
          queryClient.invalidateQueries({ queryKey: ["auth", "routers"] }),
          queryClient.invalidateQueries({ queryKey: ["auth", "sideBar"] }),
        ])
        toast.success("登录成功！")
        navigate('/')
      } 
      // else {
      //   setError(res.data.message || '登录失败') // 显示后端返回的错误信息
      // }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || '网络异常，请稍后再试') // 捕获并显示错误
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your account below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}> {/* 将 onSubmit 绑定到 form 元素 */}
            <FieldGroup >
              <Field className="!gap-2" data-invalid={errors.account?.message ? "true" : "false"}>
                <FieldLabel htmlFor="account">Account</FieldLabel>
                <Input
                  id="account"
                  type="text"
                  placeholder="Enter your account"
                  aria-invalid={errors.account?.message ? "true" : "false"}
                  {...register("account")}
                />
                {errors.account && <FieldDescription className="text-destructive mt-0 text-left">{errors.account.message}</FieldDescription>} {/* 显示账号错误信息 */}
              </Field>

              <Field className="!gap-2" data-invalid={errors.password?.message? "true" : "false"}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" >Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  aria-invalid={errors.password?.message ? "true" : "false"}
                  {...register("password")}
                  />
                {errors.password && <FieldDescription className="text-destructive mt-1 text-left">{errors.password.message}</FieldDescription>} {/* 显示密码错误信息 */}
              </Field> 

              <Field>
                <Button 
                type="submit"
                disabled={isSubmitting} // 登录中禁用按钮
                >
                  {isSubmitting?"Logging ...":"Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/auth/register" className="underline">Sign up</Link>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
