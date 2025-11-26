import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

type Option = { label: string; value: string }

type MultiSelectProps = {
  options: Option[]
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  maxTags?: number
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "请选择",
  className,
  disabled,
}: MultiSelectProps) {
  const [query, setQuery] = React.useState("")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between ${className ?? ""}`}
          disabled={disabled}
        >
          <span className="flex flex-wrap items-center gap-1.5 text-left">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              
            )}
          </span>
          <span className="text-muted-foreground text-xs">{selectedLabels.length ? `已选 ${selectedLabels.length}` : ""}</span>
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[280px]">
        <div className="p-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="max-h-[240px] overflow-auto">
          {filtered.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={value.includes(opt.value)}
              onCheckedChange={(checked) => toggle(opt.value, !!checked)}
              className="gap-2 p-2"
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
          {filtered.length === 0 && (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-muted-foreground">
              无匹配项
            </DropdownMenuItem>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Button variant="ghost" size="sm" className="text-xs" onClick={clearAll} disabled={value.length === 0}>
            清空
          </Button>
          <Button variant="ghost" size="sm" className="text-xs" onClick={selectAllFiltered} disabled={filtered.length === 0}>
            选择筛选结果
          </Button>
          <span className="text-muted-foreground ml-auto text-xs">{value.length ? `已选 ${value.length}` : ""}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}