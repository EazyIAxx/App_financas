'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
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
      toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-blue-600" />
            <span className="font-bold text-xl">FinançasPro</span>
          </Link>
        </div>
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
      </div>
    </div>
  )
}
