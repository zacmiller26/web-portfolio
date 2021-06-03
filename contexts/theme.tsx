import { createContext, useContext, useState } from "react"

type ContextProps = {}

const THEMES: string[] = ['blue', 'purple', 'orange']
const DEFAULT_THEME = THEMES[0]
const ThemeContext = createContext<Partial<ContextProps>>({})

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {

  const [theme, setTheme] = useState<typeof DEFAULT_THEME>(DEFAULT_THEME)

  const contextValues = {
    theme,
    themes: THEMES,
    setTheme
  }

  return (
    <ThemeContext.Provider value={contextValues}>
      {children}
    </ThemeContext.Provider>
  )

}

export const useTheme = (): any => {
  return useContext(ThemeContext)
}

export default ThemeProvider
