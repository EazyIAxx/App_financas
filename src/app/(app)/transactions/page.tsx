'use client'

import { useCallback, useEffect, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionForm } from '@/components/transactions/transaction-form'
import { TransactionFilters } from '@/components/transactions/transaction-filters'
import { Transaction } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { exportToCSV, FilterState } from '@/lib/utils'

const now = new Date()

const defaultFilters: FilterState = {
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  category: 'all',
  search: '',
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filtered, setFiltered] = useState<Transaction[]>([])
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const startDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
    const lastDay = new Date(filters.year, filters.month, 0).getDate()
    const endDate = `${filters.year}-${String(filters.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar transações.')
    } else {
      setTransactions((data ?? []) as Transaction[])
    }
    setLoading(false)
  }, [filters.month, filters.year])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    let result = [...transactions]
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category)
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter((t) => t.description.toLowerCase().includes(q))
    }
    setFiltered(result)
  }, [transactions, filters.category, filters.search])

  function handleFiltersChange(f: FilterState) {
    setFilters(f)
  }

  function handleExport() {
    if (filtered.length === 0) {
      toast.error('Nenhuma transação para exportar.')
      return
    }
    exportToCSV(filtered)
    toast.success('Arquivo CSV exportado!')
  }

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} transações encontradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      </div>

      <TransactionFilters filters={filters} onChange={handleFiltersChange} />

      {/* Mini summary */}
      {!loading && (
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="text-green-600 font-medium">
            Receitas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
          </span>
          <span className="text-red-600 font-medium">
            Despesas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpense)}
          </span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Carregando...</div>
      ) : (
        <TransactionList transactions={filtered} onRefresh={fetchTransactions} />
      )}

      <TransactionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSaved={fetchTransactions}
      />
    </div>
  )
}
