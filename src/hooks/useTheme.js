import { useState, useEffect } from 'react'

/**
 * Custom hook for managing theme state (light/dark mode)
 * Persists theme preference in localStorage and applies CSS classes
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    // Follow system preference by default
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme)
    // Add/remove dark class on document element
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme }
}
