'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Category, EXPENSE_CATEGORIES, INCOME_CATEGORIES, Transaction, TransactionType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  transaction?: Transaction
}

export function TransactionForm({ open, onClose, onSaved, transaction }: TransactionFormProps) {
  const isEdit = !!transaction
  const today = new Date().toISOString().split('T')[0]

  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(transaction?.amount.toString() ?? '')
  const [date, setDate] = useState(transaction?.date ?? today)
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [category, setCategory] = useState<Category | ''>(transaction?.category ?? '')
  const [loading, setLoading] = useState(false)

  const categoryOptions = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function resetForm() {
    setDescription('')
    setAmount('')
    setDate(today)
    setType('expense')
    setCategory('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) {
      toast.error('Selecione uma categoria.')
      return
    }
    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Informe um valor válido maior que zero.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Sessão expirada. Faça login novamente.')
      setLoading(false)
      return
    }

    const payload = {
      description,
      amount: parsedAmount,
      date,
      type,
      category,
      user_id: user.id,
    }

    let error
    if (isEdit) {
      ;({ error } = await supabase.from('transactions').update(payload).eq('id', transaction.id))
    } else {
      ;({ error } = await supabase.from('transactions').insert(payload))
    }

    if (error) {
      toast.error('Erro ao salvar transação: ' + error.message)
    } else {
      toast.success(isEdit ? 'Transação atualizada!' : 'Transação adicionada!')
      if (!isEdit) resetForm()
      onSaved()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['income', 'expense'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setType(t); setCategory('') }}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    type === t
                      ? t === 'income'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-red-600 text-white border-red-600'
                      : 'border-input bg-background hover:bg-muted'
                  }`}
                >
                  {t === 'income' ? 'Receita' : 'Despesa'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
