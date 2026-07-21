'use client'
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>
export default function ThemeProviders({children,...props}:ThemeProviderProps) {
  return(<NextThemesProvider {...props}>{children}</NextThemesProvider>)
}
