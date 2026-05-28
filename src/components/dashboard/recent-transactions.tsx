import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Transações Recentes</CardTitle>
        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma transação encontrada
          </p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(t.date)} · {t.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ml-4 flex-shrink-0 ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
