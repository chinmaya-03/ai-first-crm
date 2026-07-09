import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  resolved: 'light' | 'dark'
}

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const stored = localStorage.getItem('theme') as ThemeMode | null
const initialMode: ThemeMode = stored ?? 'system'
const initialResolved = initialMode === 'system' ? getSystemTheme() : initialMode

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: initialMode,
    resolved: initialResolved,
  } satisfies ThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
      state.resolved = action.payload === 'system' ? getSystemTheme() : action.payload
      localStorage.setItem('theme', action.payload)
    },
    setResolvedTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.resolved = action.payload
    },
  },
})

export const { setTheme, setResolvedTheme } = themeSlice.actions
export default themeSlice.reducer
