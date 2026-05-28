'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Mail, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      toast.error(error.message)
    } else {
      setEmailSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-xl">FinançasPro</span>
          </Link>
        </div>

        {emailSent ? (
          /* ── Tela de confirmação de e-mail ── */
          <Card className="text-center">
            <CardContent className="pt-8 pb-8 space-y-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                    <Mail className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold">Verifique seu e-mail</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Enviamos um link de confirmação para
                </p>
                <p className="font-semibold text-blue-600 text-sm break-all">{email}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-left space-y-2">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  O que fazer agora?
                </p>
                <ol className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-decimal list-inside">
                  <li>Abra sua caixa de entrada</li>
                  <li>Procure o e-mail do <strong>FinançasPro</strong></li>
                  <li>Clique em <strong>&quot;Confirmar e-mail&quot;</strong></li>
                  <li>Volte aqui e faça login</li>
                </ol>
              </div>

              <p className="text-xs text-muted-foreground">
                Não recebeu? Verifique a pasta de spam.
              </p>

              <Link href="/login" className="block">
                <Button className="w-full">Ir para o login</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* ── Formulário de cadastro ── */
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Criar conta grátis</CardTitle>
              <CardDescription>Preencha os dados abaixo para começar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmar senha</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
