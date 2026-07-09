import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { FollowUpTask, Notification, TaskStatus } from '@/types'
import {
  mockActivities,
  mockDashboardStats,
  mockNotifications,
  mockReportMetrics,
  mockTasks,
} from '@/services/mockData'

interface DashboardState {
  stats: typeof mockDashboardStats
  tasks: FollowUpTask[]
  activities: typeof mockActivities
  notifications: Notification[]
  reportMetrics: typeof mockReportMetrics
}

const initialState: DashboardState = {
  stats: mockDashboardStats,
  tasks: mockTasks,
  activities: mockActivities,
  notifications: mockNotifications,
  reportMetrics: mockReportMetrics,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id)
      if (task) task.status = action.payload.status
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload)
      if (notif) notif.read = true
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true
      })
    },
    addTask: (state, action: PayloadAction<FollowUpTask>) => {
      state.tasks.unshift(action.payload)
    },
  },
})

export const { updateTaskStatus, markNotificationRead, markAllNotificationsRead, addTask } =
  dashboardSlice.actions

export default dashboardSlice.reducer
