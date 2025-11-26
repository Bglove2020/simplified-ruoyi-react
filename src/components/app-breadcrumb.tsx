import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLocation } from "react-router-dom"

function useBreadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  return pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`
    const isLast = index === pathnames.length - 1
    return {
      to,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      isLast,
    }
  })
}

export function AppBreadcrumb() {
  const breadcrumbs = useBreadcrumb()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.to}>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground font-normal">{crumb.label}</BreadcrumbPage>
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}