import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react'
import Login from './pages/Login'
import DashboardSimple from './pages/DashboardSimple'
import { useAuthStore } from './store/authStore'
import { authAPI } from './services/api'

function App() {
  const { user, setUser, clearAuth } = useAuthStore()

  // Validate stored session on app mount
  useEffect(() => {
    const validateSession = async () => {
      // Check if user is in store
      if (user) {
        try {
          // Verify session is still valid on backend
          await authAPI.getCurrentUser()
          // Session is valid, keep user logged in
        } catch (error) {
          // Session is invalid (404, 401, etc), clear it
          clearAuth()
        }
      }
    }

    validateSession()
  }, []) // Run only once on app mount

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardSimple />} />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
