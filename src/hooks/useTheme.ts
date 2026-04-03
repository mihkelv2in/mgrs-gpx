import { useState } from 'react'

interface UseThemeReturn {
  dark: boolean
  toggle: () => void
}

export function useTheme(): UseThemeReturn {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') !== 'light'
  )

  function toggle() {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return { dark, toggle }
}
