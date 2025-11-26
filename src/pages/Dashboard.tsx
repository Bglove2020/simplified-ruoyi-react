import { ChartAreaInteractive } from "@/components/area-chart"
import {ChartBarDefault} from "@/components/Chart/bar"
import {ChartBarHorizontal} from "@/components/Chart/bar-horizontal"
import {ChartBarMultiple} from "@/components/Chart/bar-multiple"

export default function Dashboard() {
  
  return (
    <div className="px-8 py-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-4">
        <ChartBarDefault />
        <ChartBarHorizontal />
        <ChartBarMultiple />
      </div>
      <ChartAreaInteractive />
    </div>
  )
}
