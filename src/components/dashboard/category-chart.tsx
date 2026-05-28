'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryData } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface CategoryChartProps {
  data: CategoryData[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: CategoryData }> }) {
  if (active && payload && payload.length) {
    const item = payload[0]
    return (
      <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold">{item.name}</p>
        <p className="text-muted-foreground">{formatCurrency(item.value)}</p>
      </div>
    )
  }
  return null
}

export function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Nenhuma despesa no período
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
