import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { CategoryChart } from '@/components/dashboard/category-chart'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { DashboardPeriodFilter } from '@/components/dashboard/period-filter'
import { buildCategoryChartData, MONTHS } from '@/lib/utils'
import { Transaction } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams
  const now = new Date()
  const month = Number(params.month ?? now.getMonth() + 1)
  const year = Number(params.year ?? now.getFullYear())

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0)
  const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: false })

  const txs = (transactions ?? []) as Transaction[]
  const totalIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense
  const expenseChartData = buildCategoryChartData(txs, 'expense')
  const incomeChartData = buildCategoryChartData(txs, 'income')
  const recent = txs.slice(0, 5)
  const monthLabel = MONTHS.find((m) => m.value === month)?.label ?? ''

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm capitalize">
            {monthLabel} de {year}
          </p>
        </div>
        <DashboardPeriodFilter month={month} year={year} />
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart
          data={expenseChartData}
          title="Despesas por Categoria"
          emptyMessage="Nenhuma despesa no período"
        />
        <CategoryChart
          data={incomeChartData}
          title="Receitas por Categoria"
          emptyMessage="Nenhuma receita no período"
        />
      </div>

      <RecentTransactions transactions={recent} />
    </div>
  )
}
