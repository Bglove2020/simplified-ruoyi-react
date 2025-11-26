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
import { useState } from "react"
import { axiosClient } from "@/lib/apiClient"
import { useNavigate } from "react-router-dom" // 引入 useNavigate

const LoginSchema = z.object({
  // 必填，且必須是有效的 email 格式
  userAccount: z.string().min(6, { message: "账号长度至少为6位" }),
  // 必填，長度至少為 8
  password: z.string().min(8, { message: "密碼長度至少為 8 個字元" }),
});

type TLoginSchema = z.infer<typeof LoginSchema>;

export function LoginForm() {
    
  const [userAccount, setUserAccount] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // 添加 error 状态
  const navigate = useNavigate() // 初始化 useNavigate

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 清除之前的错误信息
    setError(null) 

    // 验证表单数据
    const validationResult = LoginSchema.safeParse({userAccount, password});
    if (!validationResult.success) {
      // 提取第一个错误信息
      const firstError = validationResult.error.issues[0].message;
      setError(firstError); // 设置错误信息
      return; // 阻止后续执行
    }

    // 开启加载提示
    setLoading(true)

    try {
      const res = await axiosClient.post('/auth/login', {userAccount, password})
      console.log(res)
      // else{
      //   setError(res.data.message || '登录失败') // 显示后端返回的错误信息
      // }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || '网络异常，请稍后再试') // 捕获并显示错误
    } finally {
      setLoading(false)
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="account">Account</FieldLabel>
                <Input
                  id="account"
                  type="text"
                  placeholder="Enter your account"
                  onChange={(e) => {setUserAccount(e.target.value);console.log(e.target.value)}}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-gray-500"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  onChange={(e) => {setPassword(e.target.value);console.log(e.target.value)}} 
                  required 
                  />
                  <FieldDescription className="text-red-500">
                    {error}
                </FieldDescription>
              </Field>
              
              <Field>
                <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={loading} // 登录中禁用按钮
                >
                  {loading?"Logging ...":"Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
