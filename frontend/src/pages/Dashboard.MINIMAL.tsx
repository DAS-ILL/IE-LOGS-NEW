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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        clearAuth()
        navigate('/login')
      }
    }

    if (!user) {
      fetchUser()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      clearAuth()
      message.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      message.error('Logout failed')
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#1890ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0 }}>IE LOGS - {user?.role}</h1>
        <Button type="primary" danger onClick={handleLogout} icon={<LogoutOutlined />}>
          Logout
        </Button>
      </Header>

      <Content style={{ padding: '20px' }}>
        <Space style={{ marginBottom: '20px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
            New Project
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => setExportModalVisible(true)}>
            Export
          </Button>
        </Space>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'my-projects',
              label: 'My Projects',
              children: <MyProjectsTab refreshTrigger={refreshTrigger} onEditProject={handleEditProject} />,
            },
            {
              key: 'team-projects',
              label: 'Team Projects',
              children: <TeamProjectsTab refreshTrigger={refreshTrigger} onEditProject={handleEditProject} />,
            },
          ]}
        />

        <ProjectModal
          visible={projectModalVisible}
          project={selectedProject}
          onClose={handleProjectModalClose}
        />

        <ExportModal
          visible={exportModalVisible}
          onClose={handleExportModalClose}
        />
      </Content>
    </Layout>
  )
}

export default Dashboard
