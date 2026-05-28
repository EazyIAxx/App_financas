'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

/** Botão compacto (ícone) — usado na topbar mobile */
export function ThemeToggleIcon() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8" />
  const isDark = theme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      {isDark
        ? <Sun className="h-4 w-4 text-yellow-400" />
        : <Moon className="h-4 w-4" />}
    </Button>
  )
}

/** Botão largo com rótulo — usado na sidebar desktop */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9" />
  const isDark = theme === 'dark'
  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark
        ? <Sun className="h-4 w-4 text-yellow-400 shrink-0" />
        : <Moon className="h-4 w-4 shrink-0" />}
      <span className="text-sm">{isDark ? 'Tema Claro' : 'Tema Escuro'}</span>
    </Button>
  )
}
