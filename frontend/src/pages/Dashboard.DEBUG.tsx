import { useState, useEffect } from 'react'
import { Layout, Button, message, Space, Alert } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authAPI, projectAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { Project } from '../types'

const { Header, Content } = Layout

const DashboardDebug = () => {
  const navigate = useNavigate()
  const { user, setUser, clearAuth } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        setDebugInfo('Fetching current user...')
        const userData = await authAPI.getCurrentUser()
        setDebugInfo((prev: string) => prev + '\n✓ Got user: ' + userData.username)
        setUser(userData)
        
        setDebugInfo((prev: string) => prev + '\nFetching projects...')
        const projResponse = await projectAPI.getMyProjects({ page: 1, page_size: 50 })
        setDebugInfo((prev: string) => prev + '\n✓ Got projects: ' + projResponse.count)
        setProjects(projResponse.results)
        
        setIsLoading(false)
      } catch (error: any) {
        setDebugInfo((prev: string) => prev + '\n✗ Error: ' + error.message)
        clearAuth()
        navigate('/login')
      }
    }

    if (!user) {
      fetchUser()
    } else {
      setDebugInfo('User already in store: ' + user.username)
      setIsLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    try {
      clearAuth()
      await authAPI.logout()
      message.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      message.success('Logged out successfully')
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <Alert message="Loading..." type="info" />
          <pre style={{ marginTop: 20, textAlign: 'left', background: '#f5f5f5', padding: 10 }}>
            {debugInfo}
          </pre>
        </Content>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <Alert message="No user, redirecting..." type="warning" />
        </Content>
      </Layout>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
          IE LOGS - Project Management
        </div>
        <Space>
          <span style={{ marginRight: 16 }}>
            Welcome, {user.username}
          </span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Alert
          message="DEBUG MODE"
          description={
            <div>
              <p><strong>User:</strong> {user.username} ({user.role})</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Projects:</strong> {projects.length}</p>
              {projects.length > 0 && (
                <div>
                  <p><strong>First Project:</strong></p>
                  <pre style={{ background: '#f0f0f0', padding: 10, fontSize: 12 }}>
                    {JSON.stringify(projects[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          }
          type="info"
        />
      </Content>
    </Layout>
  )
}

export default DashboardDebug
