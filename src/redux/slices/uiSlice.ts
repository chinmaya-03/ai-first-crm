import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  aiPanelOpen: boolean
  searchQuery: string
  activeModal: string | null
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  aiPanelOpen: true,
  searchQuery: '',
  activeModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarMobileOpen = action.payload
    },
    toggleAiPanel: (state) => {
      state.aiPanelOpen = !state.aiPanelOpen
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  toggleAiPanel,
  setSearchQuery,
  openModal,
  closeModal,
} = uiSlice.actions

export default uiSlice.reducer
