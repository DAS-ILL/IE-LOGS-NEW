import { useState, useEffect } from 'react'
import { Layout, Tabs, Button, message, Space } from 'antd'
import { LogoutOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import MyProjectsTab from '../components/Dashboard/MyProjectsTab'
import TeamProjectsTab from '../components/Dashboard/TeamProjectsTab'
import ProjectModal from '../components/Dashboard/ProjectModal'
import ExportModal from '../components/Dashboard/ExportModal'
import { Project } from '../types'

const { Header, Content } = Layout

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, setUser, clearAuth } = useAuthStore()
  const [activeTab, setActiveTab] = useState('my-projects')
  const [projectModalVisible, setProjectModalVisible] = useState(false)
  const [exportModalVisible, setExportModalVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch current user on mount only once
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        console.log('[Dashboard] Fetching current user...')
        const userData = await authAPI.getCurrentUser()
        console.log('[Dashboard] Current user fetched:', userData)
        setUser(userData)
        setIsLoading(false)
      } catch (error: any) {
        console.error('[Dashboard] Failed to fetch user:', error)
        clearAuth()
        navigate('/login')
      }
    }

    console.log('[Dashboard] useEffect - user from store:', user)
    if (!user) {
      fetchUser()
    } else {
      console.log('[Dashboard] User already in store, skipping fetch')
      setIsLoading(false)
    }
  }, []) // Empty deps - run only on mount

  // Show loading while fetching user
  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <p>Loading...</p>
        </Content>
      </Layout>
    )
  }

  // Redirect if no user
  if (!user) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <p>Redirecting to login...</p>
        </Content>
      </Layout>
    )
  }

  const handleLogout = async () => {
    try {
      // Clear auth immediately to prevent re-login issues
      clearAuth()
      // Then try to notify backend
      await authAPI.logout()
      message.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      // Even if API fails, user is already logged out locally
      message.success('Logged out successfully')
      navigate('/login')
    }
  }

  const handleCreateProject = () => {
    setSelectedProject(null)
    setProjectModalVisible(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setProjectModalVisible(true)
  }

  const handleProjectModalClose = (refreshData?: boolean) => {
    setProjectModalVisible(false)
    setSelectedProject(null)
    if (refreshData) {
      setRefreshTrigger((prev) => prev + 1)
    }
  }

  const handleExportModalClose = () => {
    setExportModalVisible(false)
  }

  const tabItems = [
    {
      key: 'my-projects',
      label: 'My Projects',
      children: (
        <MyProjectsTab
          onEditProject={handleEditProject}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
    {
      key: 'team-projects',
      label: 'Team Projects',
      children: (
        <TeamProjectsTab
          onEditProject={handleEditProject}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
  ]

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
            Welcome, {user?.first_name || user?.username}{' '}
            <span style={{ color: '#888' }}>({user?.role})</span>
          </span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
              New Project Entry
            </Button>
          </Space>
          {user?.role === 'admin' && (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => setExportModalVisible(true)}
            >
              Export Projects
            </Button>
          )}
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Content>

      <ProjectModal
        visible={projectModalVisible}
        project={selectedProject}
        onClose={handleProjectModalClose}
      />

      {user?.role === 'admin' && (
        <ExportModal visible={exportModalVisible} onClose={handleExportModalClose} />
      )}
    </Layout>
  )
}

export default Dashboard


