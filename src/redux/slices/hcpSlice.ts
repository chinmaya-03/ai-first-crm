import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HCP } from '@/types'
import { mockHcps } from '@/services/mockData'

interface HCPState {
  hcps: HCP[]
  selectedHcp: HCP | null
  searchFilter: string
  specialtyFilter: string
}

const initialState: HCPState = {
  hcps: mockHcps,
  selectedHcp: null,
  searchFilter: '',
  specialtyFilter: 'all',
}

const hcpSlice = createSlice({
  name: 'hcp',
  initialState,
  reducers: {
    setSelectedHcp: (state, action: PayloadAction<HCP | null>) => {
      state.selectedHcp = action.payload
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload
    },
    setSpecialtyFilter: (state, action: PayloadAction<string>) => {
      state.specialtyFilter = action.payload
    },
    selectHcpById: (state, action: PayloadAction<string>) => {
      state.selectedHcp = state.hcps.find((h) => h.id === action.payload) ?? null
    },
  },
})

export const { setSelectedHcp, setSearchFilter, setSpecialtyFilter, selectHcpById } =
  hcpSlice.actions

export default hcpSlice.reducer
