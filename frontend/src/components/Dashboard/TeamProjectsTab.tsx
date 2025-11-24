import { useState, useEffect } from 'react'
import { Table, Button, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { projectAPI } from '../../services/api'
import { Project, ProjectFilters } from '../../types'
import { useAuthStore } from '../../store/authStore'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const MST_TIMEZONE = 'America/Phoenix'

interface TeamProjectsTabProps {
  onEditProject: (project: Project) => void
  refreshTrigger: number
}

const TeamProjectsTab = ({ onEditProject, refreshTrigger }: TeamProjectsTabProps) => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [filters, setFilters] = useState<ProjectFilters>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  // Helper function to format datetime (extract time from ISO string with timezone)
  const formatDateTime = (dateTimeStr: string | null | undefined): string => {
    if (!dateTimeStr) return ''
    // Backend sends: "2025-11-20T23:25:08.679618-07:00"
    // Extract the date and time part before the timezone offset
    const match = dateTimeStr.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/)
    if (match) {
      return `${match[1]} ${match[2]}`
    }
    return dateTimeStr
  }

  useEffect(() => {
    fetchProjects()
  }, [currentPage, pageSize, filters, refreshTrigger])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
        ...filters,
      }
      const response = await projectAPI.getTeamProjects(params)
      setProjects(response.results)
      setTotal(response.count)
    } catch (error: any) {
      message.error('Failed to fetch team projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (user?.role !== 'admin') {
      message.error('Only admins can delete team projects')
      return
    }

    try {
      await projectAPI.deleteProject(id)
      message.success('Project deleted successfully')
      fetchProjects()
    } catch (error: any) {
      message.error('Failed to delete project')
    }
  }

  const handleBulkDelete = async () => {
    if (user?.role !== 'admin') {
      message.error('Only admins can bulk delete projects')
      return
    }

    if (selectedRowKeys.length === 0) {
      message.warning('Please select projects to delete')
      return
    }

    try {
      await projectAPI.bulkDelete(selectedRowKeys)
      message.success(`Successfully deleted ${selectedRowKeys.length} project(s)`)
      setSelectedRowKeys([])
      fetchProjects()
    } catch (error: any) {
      message.error('Failed to bulk delete projects')
    }
  }

  const columns: ColumnsType<Project> = [
    {
      title: 'Application #',
      dataIndex: 'application_number',
      key: 'application_number',
      width: 150,
      fixed: 'left',
      filters: Array.from(new Set(projects.map(p => p.application_number).filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => record.application_number === value,
      filterSearch: true,
    },
    {
      title: 'Account Name',
      dataIndex: 'account_name',
      key: 'account_name',
      width: 200,
      filters: Array.from(new Set(projects.map(p => p.account_name).filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => record.account_name === value,
      filterSearch: true,
    },
    {
      title: 'Project Court',
      dataIndex: 'project_court',
      key: 'project_court',
      width: 150,
      filters: Array.from(new Set(projects.map(p => p.project_court).filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => record.project_court === value,
      filterSearch: true,
    },
    {
      title: 'Reviewed By',
      dataIndex: 'reviewed_by',
      key: 'reviewed_by',
      width: 150,
      filters: Array.from(new Set(projects.map(p => p.reviewed_by).filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => record.reviewed_by === value,
      filterSearch: true,
    },
    {
      title: 'Status',
      dataIndex: 'project_status',
      key: 'project_status',
      width: 120,
      filters: [
        { text: 'Approve', value: 'Approve' },
        { text: 'Conditional Approve', value: 'Conditional Approve' },
        { text: 'Reject', value: 'Reject' },
        { text: 'Review', value: 'Review' },
      ],
      onFilter: (value: any, record: Project) => record.project_status === value,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 120,
      filters: [
        { text: 'Started', value: 'Started' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value: any, record: Project) => record.stage === value,
      render: (stage: any) => (
        <span style={{ color: stage === 'Completed' ? '#52c41a' : '#faad14' }}>
          {stage}
        </span>
      ),
    },
    {
      title: 'Total Time (mins)',
      dataIndex: 'total_time',
      key: 'total_time',
      width: 140,
      sorter: (a: Project, b: Project) => {
        const timeA = a.total_time ? (typeof a.total_time === 'string' ? parseFloat(a.total_time) : a.total_time) : 0
        const timeB = b.total_time ? (typeof b.total_time === 'string' ? parseFloat(b.total_time) : b.total_time) : 0
        return timeA - timeB
      },
      render: (time: any) => {
        if (!time) return '0'
        const num = typeof time === 'string' ? parseFloat(time) : time
        return isNaN(num) ? '0' : Math.round(num).toString()
      },
    },
    {
      title: 'Completed Date',
      dataIndex: 'completed_date',
      key: 'completed_date',
      width: 140,
      filters: Array.from(new Set(projects.map(p => p.completed_date ? formatDateTime(p.completed_date)?.split(' ')[0] : '').filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => {
        const completedDate = record.completed_date ? formatDateTime(record.completed_date)?.split(' ')[0] : ''
        return completedDate === value
      },
      filterSearch: true,
      sorter: (a: Project, b: Project) => {
        if (!a.completed_date) return 1
        if (!b.completed_date) return -1
        return new Date(a.completed_date).getTime() - new Date(b.completed_date).getTime()
      },
      render: (date: string) => formatDateTime(date)?.split(' ')[0] || '', // Show only date part
    },
    {
      title: 'Created By',
      dataIndex: 'created_by_username',
      key: 'created_by_username',
      width: 120,
      filters: Array.from(new Set(projects.map(p => p.created_by_username).filter(Boolean))).map(value => ({ text: value, value })),
      onFilter: (value: any, record: Project) => record.created_by_username === value,
    },
    {
      title: 'Created At (MST)',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
  ]

  const rowSelection = user?.role === 'admin' ? {
    selectedRowKeys,
    onChange: (selectedKeys: any) => {
      setSelectedRowKeys(selectedKeys as number[])
    },
  } : undefined

  return (
    <div>
      {/* Bulk Delete Button - Visible at top for admin when rows selected */}
      {user?.role === 'admin' && selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Popconfirm
            title={`Are you sure you want to delete ${selectedRowKeys.length} project(s)?`}
            onConfirm={handleBulkDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="large">
              Delete Selected ({selectedRowKeys.length})
            </Button>
          </Popconfirm>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total: any) => `Total ${total} projects`,
          onChange: (page: any, size: any) => {
            setCurrentPage(page)
            setPageSize(size)
          },
        }}
        scroll={{ x: 1700 }}
        onRow={(record: any) => ({
          onClick: (e: any) => {
            // Don't trigger row click if clicking on action buttons
            if (!e.target.closest('button') && !e.target.closest('.ant-checkbox-wrapper')) {
              onEditProject(record)
            }
          },
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  )
}

export default TeamProjectsTab
