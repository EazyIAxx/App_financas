import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Category, CategoryData, Transaction } from './types'

export type { FilterState } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentação: '#f97316',
  Transporte: '#3b82f6',
  Moradia: '#8b5cf6',
  Lazer: '#ec4899',
  Saúde: '#10b981',
  Educação: '#f59e0b',
  Salário: '#22c55e',
  Freelance: '#06b6d4',
  Outros: '#6b7280',
}

export function buildCategoryChartData(transactions: Transaction[]): CategoryData[] {
  const map: Partial<Record<Category, number>> = {}
  for (const t of transactions) {
    if (t.type === 'expense') {
      map[t.category] = (map[t.category] ?? 0) + t.amount
    }
  }
  return Object.entries(map)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value: value as number,
      color: CATEGORY_COLORS[name as Category],
    }))
}

export function exportToCSV(transactions: Transaction[], filename = 'transacoes.csv') {
  const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']
  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description}"`,
    t.type === 'income' ? 'Receita' : 'Despesa',
    t.category,
    t.amount.toFixed(2).replace('.', ','),
  ])

  const csvContent = [headers, ...rows].map((r) => r.join(';')).join('\n')
  const bom = '﻿'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function getMonthName(month: number): string {
  return new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
    new Date(2000, month - 1, 1)
  )
}

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1),
}))
