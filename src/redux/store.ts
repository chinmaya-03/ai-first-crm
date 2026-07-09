import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slices/chatSlice'
import interactionReducer from './slices/interactionSlice'
import hcpReducer from './slices/hcpSlice'
import dashboardReducer from './slices/dashboardSlice'
import uiReducer from './slices/uiSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    interaction: interactionReducer,
    hcp: hcpReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
