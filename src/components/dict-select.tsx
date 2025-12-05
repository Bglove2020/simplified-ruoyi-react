import { useDictOptions } from "@/lib/dictQueries";
import {
  SingleSelect,
  type SingleSelectProps,
} from "@/components/single-select";
import { Loader2 } from "lucide-react";

export interface DictSelectProps extends Omit<SingleSelectProps, "options"> {
  /** 字典类型 */
  dictType: string | null | undefined;
  /** 是否过滤停用数据，默认为 true */
  filterStatus?: boolean;
  /** 是否启用查询，默认为 true */
  enabled?: boolean;
}

/**
 * 字典选择器组件
 * 自动从字典系统加载选项数据
 *
 * @example
 * ```tsx
 * <DictSelect
 *   dictType="sys_user_sex"
 *   value={value}
 *   onChange={onChange}
 *   placeholder="请选择性别"
 * />
 * ```
 */
export function DictSelect({
  dictType,
  filterStatus = true,
  enabled = true,
  disabled,
  ...props
}: DictSelectProps) {
  const { options, isLoading, error } = useDictOptions(
    dictType,
    enabled,
    filterStatus
  );

  // 如果加载失败，显示错误信息（可选）
  if (error) {
    console.error("加载字典数据失败:", error);
  }

  return (
    <div className="relative">
      <SingleSelect
        {...props}
        options={options}
        disabled={disabled || isLoading}
      />
      {/* {isLoading && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )} */}
    </div>
  );
}
