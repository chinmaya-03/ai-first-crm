import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Interaction, InteractionFormData } from '@/types'
import { DEFAULT_INTERACTION_FORM } from '@/types'
import { mockInteractions } from '@/services/mockData'

interface InteractionState {
  form: InteractionFormData
  interactions: Interaction[]
  isSaving: boolean
  lastSaved: string | null
}

const initialState: InteractionState = {
  form: { ...DEFAULT_INTERACTION_FORM },
  interactions: mockInteractions,
  isSaving: false,
  lastSaved: null,
}

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<InteractionFormData>>) => {
      state.form = { ...state.form, ...action.payload }
    },
    resetForm: (state) => {
      state.form = { ...DEFAULT_INTERACTION_FORM }
    },
    applyAIResult: (state, action: PayloadAction<Partial<InteractionFormData>>) => {
  console.log("========== REDUX ==========")
  console.log("BEFORE:", state.form)
  console.log("PAYLOAD:", action.payload)

  state.form = {
    ...state.form,
    ...action.payload,
  }

  console.log("AFTER:", state.form)
},
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    },
    saveInteraction: (state) => {
      const interaction: Interaction = {
        ...state.form,
        id: `int-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      state.interactions.unshift(interaction)
      state.lastSaved = new Date().toISOString()
      state.isSaving = false
    },
    addMaterial: (state, action: PayloadAction<{ id: string; name: string; category: string }>) => {
      if (!state.form.materials.find((m) => m.id === action.payload.id)) {
        state.form.materials.push(action.payload)
      }
    },
    removeMaterial: (state, action: PayloadAction<string>) => {
      state.form.materials = state.form.materials.filter((m) => m.id !== action.payload)
    },
    addSample: (state, action: PayloadAction<{ id: string; name: string; quantity: number }>) => {
      state.form.samples.push(action.payload)
    },
    removeSample: (state, action: PayloadAction<string>) => {
      state.form.samples = state.form.samples.filter((s) => s.id !== action.payload)
    },
  },
})

export const {
  updateForm,
  resetForm,
  applyAIResult,
  setSaving,
  saveInteraction,
  addMaterial,
  removeMaterial,
  addSample,
  removeSample,
} = interactionSlice.actions

export default interactionSlice.reducer
