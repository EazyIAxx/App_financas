'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate, CATEGORY_COLORS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { TransactionForm } from './transaction-form'

interface TransactionListProps {
  transactions: Transaction[]
  onRefresh: () => void
}

export function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [editTarget, setEditTarget] = useState<Transaction | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', deleteTarget.id)
    if (error) {
      toast.error('Erro ao excluir: ' + error.message)
    } else {
      toast.success('Transação excluída.')
      onRefresh()
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        Nenhuma transação encontrada para os filtros aplicados.
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-muted-foreground text-sm">{formatDate(t.date)}</TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[t.category] }}
                    />
                    {t.category}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={t.type === 'income'
                      ? 'border-green-500 text-green-700 bg-green-50'
                      : 'border-red-500 text-red-700 bg-red-50'
                    }
                  >
                    {t.type === 'income' ? 'Receita' : 'Despesa'}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTarget(t)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(t)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="bg-card rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{t.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(t.date)} · {t.category}
                </p>
              </div>
              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge
                variant="outline"
                className={`text-xs ${t.type === 'income'
                  ? 'border-green-500 text-green-700 bg-green-50'
                  : 'border-red-500 text-red-700 bg-red-50'
                }`}
              >
                {t.type === 'income' ? 'Receita' : 'Despesa'}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTarget(t)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteTarget(t)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit dialog */}
      {editTarget && (
        <TransactionForm
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={onRefresh}
          transaction={editTarget}
        />
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir transação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir &quot;{deleteTarget?.description}&quot;? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
