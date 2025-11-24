import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/api'

const DashboardSimple = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      authAPI
        .getCurrentUser()
        .then((userData) => {
          setUser(userData)
          setLoading(false)
        })
        .catch((err) => {
          setError('Failed to fetch user: ' + err.message)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  if (!user) {
    return <div>No user, redirecting...</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>User: {user.username}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => navigate('/login')}>Logout</button>
    </div>
  )
}

export default DashboardSimple
