'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, List, LogOut, Menu, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/transactions', label: 'Transações', icon: List },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1">
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-blue-600 text-white'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}

export function Navbar({ userEmail }: { userEmail: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Sessão encerrada.')
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r bg-background h-screen sticky top-0 p-4 gap-4">
        <div className="flex items-center gap-2 px-3 py-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-base">FinançasPro</span>
        </div>
        <Separator />
        <div className="flex-1">
          <NavLinks />
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span className="font-bold">FinançasPro</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span className="font-bold">FinançasPro</span>
            </div>
            <Separator />
            <div className="flex-1">
              <NavLinks />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground px-3 truncate">{userEmail}</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        </div>
      </header>
    </>
  )
}
