import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CircleX } from "lucide-react"

type Tab = {
  path: string
  label: string
  fixed?: boolean
}

// 固化的默认标签页列表（首页不可关闭）
const defaultTabs: Tab[] = [
  // { path: "/app", label: "首页", fixed: true },
  { path: "/app/users", label: "用户管理" },
  { path: "/app/settings", label: "系统设置" },
]

export function OpenTabsBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs)

  const closeTab = (path: string) => {
    setTabs((prev) => {
      const target = prev.find((t) => t.path === path)
      if (target?.fixed) return prev // 固定标签不可关闭
      const next = prev.filter((t) => t.path !== path)
      if (location.pathname === path) {
        const fallback = next.length ? next[next.length - 1].path : "/app"
        navigate(fallback)
      }
      return next
    })
  }

  return (
    // <div className="flex items-center gap-1 px-2 py-1  gap-4 shadow-sm mx-2 mb-4 rounded-md bg-muted">
    <div className="flex items-center gap-4 py-1 px-4 border-b border-border min">
      <Button
              size="sm"
              className="text-inherit rounded-full shadow-sm px-4 h-7 bg-secondary"
              onClick={() => navigate('/')}
            >
              首页
            </Button>
    {tabs.length === 0 ? (
        <span className="text-sm text-muted-foreground">暂无已打开的页面</span>
      ) : (
        tabs.map((tab) => {
          const active = tab.path === location.pathname
          return (
            <Button
              key={tab.path}
              variant={active ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full shadow-sm pl-4 pr-2 h-7 bg-muted gap-0 transition-colors duration-100 ease-out hover:bg-card hover:text-md"
              onClick={() => navigate(tab.path)}
            >
              <span>{tab.label}</span>
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full shrink-0 transition-transform duration-100 ease-out hover:scale-[var(--tabs-icon-hover-scale,1.15)] hover:text-[var(--tabs-icon-hover-color,#ff4d4f)]">
                <CircleX className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </Button>
            // <div key={tab.path} className="flex items-center hover:bg-muted-foreground">
            //   <Button
            //     variant={active ? "secondary" : "ghost"}
            //     size="sm"
            //     className="rounded-md px-0"
            //     onClick={() => navigate(tab.path)}
            //   >
            //     {tab.label}
            //   </Button>
            //   {!tab.fixed && (
            //     <Button
            //       variant="ghost"
            //       size="sm"
            //       className="px-2 text-muted-foreground"
            //       onClick={() => closeTab(tab.path)}
            //       aria-label="关闭标签"
            //       title="关闭标签"
            //     >
            //       <CircleX />
            //     </Button>
            //   )}
            // </div>
          )
        })
      )}
    </div>
  )
}
