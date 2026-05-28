import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Smartphone, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">FinançasPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Criar conta grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-green-50 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>Controle financeiro simplificado</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Suas finanças{' '}
            <span className="text-blue-600">sob controle</span>,{' '}
            de forma simples
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Registre receitas e despesas, visualize gráficos por categoria e acompanhe
            seu saldo mensal — tudo em um só lugar, de graça.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Começar gratuitamente <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                Já tenho uma conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-center text-gray-500 mb-14">
            Sem complicação. Recursos essenciais para o controle financeiro do dia a dia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
                title: 'Dashboard Visual',
                desc: 'Cards de resumo com receitas, despesas e saldo do mês.',
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-green-600" />,
                title: 'Gráficos por Categoria',
                desc: 'Visualize onde seu dinheiro está sendo gasto com gráficos intuitivos.',
              },
              {
                icon: <Shield className="h-6 w-6 text-purple-600" />,
                title: 'Seguro e Privado',
                desc: 'Seus dados são seus. Autenticação e isolamento por usuário.',
              },
              {
                icon: <Smartphone className="h-6 w-6 text-orange-600" />,
                title: '100% Responsivo',
                desc: 'Funciona perfeitamente no celular, tablet e desktop.',
              },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border bg-gray-50">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para organizar suas finanças?
          </h2>
          <p className="text-blue-100 mb-8">
            Crie sua conta gratuitamente e comece hoje mesmo.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2 px-8">
              Criar conta grátis <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-sm text-gray-400 bg-white">
        © {new Date().getFullYear()} FinançasPro. Feito com Next.js + Supabase.
      </footer>
    </div>
  )
}
