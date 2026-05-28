import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FinançasPro — Controle Financeiro Pessoal',
  description: 'Gerencie suas receitas e despesas de forma simples e visual.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
