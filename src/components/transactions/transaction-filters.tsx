'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category, CATEGORIES } from '@/lib/types'
import { FilterState, MONTHS } from '@/lib/utils'

interface TransactionFiltersProps {
  filters: FilterState
  onChange: (f: FilterState) => void
}

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por descrição..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </div>

      <Select
        value={String(filters.month)}
        onValueChange={(v) => set('month', Number(v))}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={String(m.value)}>
              {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(filters.year)}
        onValueChange={(v) => set('year', Number(v))}
      >
        <SelectTrigger className="w-full sm:w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(v) => set('category', v as Category | 'all')}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
