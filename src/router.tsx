import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { DashboardPage } from '@/pages/Dashboard'
import { LogInteractionPage } from '@/pages/LogInteraction'
import { HcpListPage } from '@/pages/HcpList'
import { HcpProfilePage } from '@/pages/HcpProfile'
import { InteractionHistoryPage } from '@/pages/InteractionHistory'
import { FollowUpTasksPage } from '@/pages/FollowUpTasks'
import { ReportsPage } from '@/pages/Reports'
import { SettingsPage } from '@/pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'interactions/log', element: <LogInteractionPage /> },
      { path: 'interactions', element: <InteractionHistoryPage /> },
      { path: 'hcps', element: <HcpListPage /> },
      { path: 'hcps/:id', element: <HcpProfilePage /> },
      { path: 'tasks', element: <FollowUpTasksPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
