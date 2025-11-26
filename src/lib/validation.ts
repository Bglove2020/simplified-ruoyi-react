import { z } from "zod"

// 复杂密码：至少包含字母、数字和特殊字符
export const passwordComplexRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/

// 可复用的账号校验（最小长度可配置）
export function userAccountSchema() {
  return z
  .string()
  .min(6, { message: `账号长度少于6位` })
}

// 可复用的用户名校验（最小长度可配置）
export function userNameSchema() {
  return z
  .string()
  .min(1, { message: `用户名不能为空` })
}

// 可复用的密码复杂度校验（最小长度与提示语可配置）
export function passwordSchema() {
  return z
    .string()
    .min(8, { message: `密码长度少于8位` })
    .regex(passwordComplexRegex, { message: "密码需包含英文字母、数字及特殊字符" })
}

