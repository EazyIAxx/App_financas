-- ============================================================
--  FinançasPro — Script de configuração do Supabase
--  Execute no SQL Editor do painel Supabase
-- ============================================================

-- 1. Tabela de transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  date        DATE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category    TEXT NOT NULL CHECK (category IN (
    'Alimentação','Transporte','Moradia','Lazer',
    'Saúde','Educação','Salário','Freelance','Outros'
  )),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date
  ON public.transactions (user_id, date DESC);

-- 3. Row Level Security — cada usuário vê apenas os próprios dados
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);
