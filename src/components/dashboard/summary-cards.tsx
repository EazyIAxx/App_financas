import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
}

export function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Receitas
          </CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total do período</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Despesas
          </CardTitle>
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total do período</p>
        </CardContent>
      </Card>

      <Card className={`border-l-4 ${balance >= 0 ? 'border-l-blue-500' : 'border-l-orange-500'}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldo
          </CardTitle>
          <Wallet className={`h-5 w-5 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {balance >= 0 ? 'Superávit' : 'Déficit'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
