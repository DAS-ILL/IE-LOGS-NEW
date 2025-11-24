import { useEffect, useState } from 'react'
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button, message, Space, Spin, Tooltip, Tag, Row, Col, Popconfirm } from 'antd'
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { projectAPI, lookupAPI } from '../../services/api'
import { Project, ProjectFormData, LookupData } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { calculateMinutes, formatDateTime, toMST, MST_TIMEZONE } from '../../utils/timezone'

const { TextArea } = Input
const { Option } = Select

interface ProjectModalProps {
  visible: boolean
  project: Project | null
  onClose: (refreshData?: boolean) => void
}

const ProjectModal = ({ visible, project, onClose }: ProjectModalProps) => {
  const [form] = Form.useForm()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [lookupData, setLookupData] = useState<LookupData | null>(null)
  const [startTime, setStartTime] = useState<any>(null)
  const [endTime, setEndTime] = useState<any>(null)
  const [hasStartTimeSet, setHasStartTimeSet] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsLoadingData(true)
      fetchLookupData()
      
      if (project) {
        // Populate form with project data (editing existing project)
        // Convert IST times to MST for display
        const startTimeValue = project.start_time ? toMST(project.start_time) : null
        const endTimeValue = project.end_time ? toMST(project.end_time) : null
        
        form.setFieldsValue({
          // Do NOT include completed_date - it's auto-captured by backend
          application_number: project.application_number,
          account_name: project.account_name,
          project_court: project.project_court,
          reviewed_by: project.reviewed_by,
          project_status: project.project_status,
          start_time: startTimeValue,
          end_time: endTimeValue,
          partner_installer_account: project.partner_installer_account,
          third_party_salesforce: project.third_party_salesforce,
          comments: project.comments,
          content: project.content,
          is_new_learning: project.is_new_learning,
          is_redline: project.is_redline,
        })
        setStartTime(startTimeValue)
        setEndTime(endTimeValue)
        setHasStartTimeSet(!!project.start_time)
      } else {
        // New project - reset form
        form.resetFields()
        setStartTime(null)
        setEndTime(null)
        setHasStartTimeSet(false)
      }
      
      setIsLoadingData(false)
    }
  }, [visible, project, form])

  const fetchLookupData = async () => {
    try {
      const data = await lookupAPI.getLookupData()
      setLookupData(data)
    } catch (error) {
      message.error('Failed to fetch dropdown data')
    }
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    try {
      console.log('handleSaveDraft: Starting...')
      
      // For draft, validate only the Application Number (minimum required field)
      await form.validateFields(['application_number'])
      console.log('handleSaveDraft: Application number validated')
      
      const values = form.getFieldsValue()
      console.log('handleSaveDraft: Form values:', values)
      
      // Auto-set start_time if not already set
      let startTimeValue = values.start_time
      if (!startTimeValue && !hasStartTimeSet) {
        startTimeValue = dayjs().tz(MST_TIMEZONE)
        console.log('handleSaveDraft: Auto-setting start time:', startTimeValue)
      }
      
      // Preserve the original stage if editing existing project
      // Only set stage to 'Started' for NEW projects
      const projectStage = project ? project.stage : 'Started'
      
      const formData: any = {
        application_number: values.application_number,
        account_name: values.account_name || null,
        project_court: values.project_court || null,
        reviewed_by: values.reviewed_by || null,
        project_status: values.project_status || null,
        stage: projectStage,  // Preserve original stage or set to 'Started' for new
        start_time: startTimeValue?.toISOString() || null,
        end_time: values.end_time?.toISOString() || null,
        partner_installer_account: values.partner_installer_account || null,
        third_party_salesforce: values.third_party_salesforce || null,
        comments: values.comments || null,
        content: values.content || null,
        is_new_learning: values.is_new_learning || false,
        is_redline: values.is_redline || false,
        id: project?.id,
      }
      
      // Remove null/undefined values to avoid validation errors
      Object.keys(formData).forEach(key => {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
      })
      
      console.log('handleSaveDraft: Sending data:', formData)
      await projectAPI.saveDraft(formData)
      message.success('Draft saved successfully')
      setTimeout(() => onClose(true), 500) // Small delay to ensure UI updates
    } catch (error: any) {
      console.error('Save draft error:', error)
      if (error.errorFields) {
        message.error('Please enter Application Number to save draft')
      } else if (error.response?.data) {
        console.error('Server error:', error.response.data)
        message.error(error.response.data.detail || 'Failed to save draft')
      } else {
        message.error('Failed to save draft')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()

      // Comments are mandatory on submit
      if (!values.comments || values.comments.trim() === '') {
        message.error('Comments are required when submitting a project.')
        setLoading(false)
        return
      }
      
      // Auto-set start_time if not already set
      let startTimeValue = values.start_time
      if (!startTimeValue && !hasStartTimeSet) {
        startTimeValue = dayjs().tz(MST_TIMEZONE)
      }
      
      const formData: any = {
        application_number: values.application_number,
        account_name: values.account_name || null,
        project_court: values.project_court || null,
        reviewed_by: values.reviewed_by || null,
        project_status: values.project_status || null,
        start_time: startTimeValue?.toISOString() || null,
        end_time: values.end_time?.toISOString() || null,
        partner_installer_account: values.partner_installer_account || null,
        third_party_salesforce: values.third_party_salesforce || null,
        comments: values.comments || null,
        content: values.content || null,
        is_new_learning: values.is_new_learning || false,
        is_redline: values.is_redline || false,
        id: project?.id,
      }
      
      // Remove null/undefined/empty values
      Object.keys(formData).forEach(key => {
        if (formData[key] === null || formData[key] === undefined || formData[key] === '') {
          delete formData[key]
        }
      })
      
      await projectAPI.submitProject(formData)
      message.success('Project submitted successfully')
      setTimeout(() => onClose(true), 500) // Small delay to ensure UI updates
    } catch (error: any) {
      console.error('Submit error:', error)
      if (error.errorFields) {
        message.error('Please fill in all required fields')
      } else if (error.response?.data) {
        message.error(error.response.data.detail || 'Failed to submit project')
      } else {
        message.error('Failed to submit project')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project?.id || user?.role !== 'admin') {
      message.error('Only admins can delete projects')
      return
    }

    try {
      setLoading(true)
      await projectAPI.deleteProject(project.id)
      message.success('Project deleted successfully')
      onClose(true) // Refresh data
    } catch (error: any) {
      message.error('Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  const canEdit = () => {
    if (!user) {
      console.log('canEdit: No user')
      return false
    }
    
    console.log('canEdit check:', { 
      userRole: user.role, 
      userId: user.id, 
      projectId: project?.id,
      projectCreatedBy: project?.created_by,
      projectStage: project?.stage
    })
    
    // Admin can ALWAYS edit any project
    if (user.role === 'admin') {
      console.log('canEdit: Admin - allowing edit')
      return true
    }
    
    // For new projects (no project object), user can create/edit
    if (!project) {
      console.log('canEdit: New project - allowing edit')
      return true
    }
    
    // User can edit their own project (even if completed)
    // Time fields will be disabled separately by isTimeTrackingDisabled()
    const isOwner = Number(project.created_by) === Number(user.id)
    console.log('canEdit: Ownership check:', { isOwner, projectCreatedBy: project.created_by, userId: user.id })
    
    if (isOwner) {
      console.log('canEdit: User is owner - allowing edit')
      return true
    }
    
    // User cannot edit other users' projects
    console.log('canEdit: Not owner - denying edit')
    return false
  }

  // Determine if time fields should be disabled
  const isTimeTrackingDisabled = () => {
    // Admin can always edit time fields
    if (user?.role === 'admin') return false
    
    // For regular users:
    // - Time fields are disabled for completed projects
    // - Time fields are disabled (auto-captured) for all other cases
    if (project && project.stage === 'Completed') {
      return true // Can't edit time on completed projects
    }
    
    // For regular users, time fields are ALWAYS disabled (auto-captured only)
    return true
  }

  // Handle first field entry - auto-fill start_time only when user actually types something
  const handleFirstFieldChange = (e: any) => {
    if (!hasStartTimeSet && !startTime && e.target.value && e.target.value.trim() !== '') {
      const now = dayjs().tz(MST_TIMEZONE)
      form.setFieldValue('start_time', now)
      setStartTime(now)
      setHasStartTimeSet(true)
    }
  }

  // Use the database total_time if available (for existing projects), otherwise calculate from form values
  const totalTime = project?.total_time 
    ? (typeof project.total_time === 'string' ? parseFloat(project.total_time) : project.total_time)
    : (startTime && endTime ? calculateMinutes(startTime, endTime) : 0)

  return (
    <Modal
      title={project ? 'Edit Project' : 'New Project Entry'}
      open={visible}
      onCancel={() => onClose()}
      width={1200}
      style={{ top: 20 }}
      footer={
        canEdit() ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Left side: Delete button for admin on existing projects */}
            <div>
              {user?.role === 'admin' && project?.id && (
                <Popconfirm
                  title="Are you sure you want to delete this project?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} loading={loading}>
                    Delete
                  </Button>
                </Popconfirm>
              )}
            </div>
            
            {/* Right side: Cancel and Save/Submit buttons */}
            <Space>
              <Button onClick={() => onClose()}>Cancel</Button>
              {/* For completed projects, show only Save button (not Save Draft or Submit) */}
              {project?.stage === 'Completed' ? (
                <Button type="primary" onClick={handleSaveDraft} loading={loading}>
                  Save
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveDraft} loading={loading}>
                    Save Draft
                  </Button>
                  <Button type="primary" onClick={handleSubmit} loading={loading}>
                    Submit
                  </Button>
                </>
              )}
            </Space>
          </div>
        ) : (
          <Button onClick={() => onClose()}>Close</Button>
        )
      }
    >
      {/* Stage Badge at Top */}
      {project && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Tag color={project.stage === 'Completed' ? 'green' : 'orange'} style={{ fontSize: '14px', padding: '4px 12px' }}>
            Current Stage: {project.stage}
          </Tag>
        </div>
      )}

      <Form form={form} layout="vertical" disabled={!canEdit()}>
        {/* Display Created Date and Completed Date when viewing existing project */}
        {project && (
          <div style={{ marginBottom: 16, padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <div><strong>Created Date:</strong> {project.created_at?.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/)?.[0].replace('T', ' ') || project.created_at} (MST)</div>
            {project.completed_date && (
              <div style={{ marginTop: 8 }}>
                <strong>Completed Date:</strong> {project.completed_date.match(/^(\d{4}-\d{2}-\d{2})/)?.[0] || project.completed_date}
              </div>
            )}
          </div>
        )}

        {/* Two-column layout */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="application_number"
              label="Application Number *"
              rules={[{ required: true, message: 'Please enter application number' }]}
            >
              <Input onChange={handleFirstFieldChange} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="account_name"
              label="Account Name"
            >
              <Input onChange={handleFirstFieldChange} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="project_court"
              label="Project Court"
            >
              <Select placeholder="Select court">
                {lookupData?.courts.map((court: any) => (
                  <Option key={court} value={court}>
                    {court}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="reviewed_by"
              label="Reviewed By"
            >
              <Select placeholder="Select reviewer">
                {lookupData?.reviewers.map((reviewer: any) => (
                  <Option key={reviewer} value={reviewer}>
                    {reviewer}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="project_status"
              label="Project Status"
            >
              <Select placeholder="Select status">
                <Option value="Approve">Approve</Option>
                <Option value="Conditional Approve">Conditional Approve</Option>
                <Option value="Reject">Reject</Option>
                <Option value="Review">Review</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="partner_installer_account"
              label="Partner Installer Account"
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Start Time - Auto-filled when user enters first field, read-only for users */}
            <Form.Item
              name="start_time"
              label={
                <Space>
                  {`Start Time (MST) * ${
                    user?.role !== 'admin' && hasStartTimeSet ? '(Auto-captured)' : ''
                  }`}
                  <Tooltip title="Timezone: Mountain Standard Time (MST)">
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              }
              rules={[{ required: true, message: 'Please select start time' }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                onChange={(value: any) => {
                  setStartTime(value)
                  if (value && !hasStartTimeSet) {
                    setHasStartTimeSet(true)
                  }
                }}
                disabled={isTimeTrackingDisabled()}
                placeholder="Auto-fills when you enter Application #"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* End Time - Auto-filled on submit, admins can manually edit */}
            <Form.Item
              name="end_time"
              label={
                <Space>
                  {`End Time (MST) ${
                    !endTime && user?.role !== 'admin' ? '(Auto-filled on submit)' : ''
                  }`}
                  <Tooltip title="Timezone: Mountain Standard Time (MST)">
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              }
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                onChange={(value: any) => setEndTime(value)}
                disabled={isTimeTrackingDisabled()}
                placeholder={user?.role === 'admin' ? 'Select end time' : 'Auto-fills when you submit'}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="third_party_salesforce"
              label="Third Party Salesforce"
            >
              <Select placeholder="Select option">
                {lookupData?.third_party_options.map((option: any) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            {totalTime > 0 && (
              <div style={{ marginTop: 30, padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                <strong>Total Time:</strong> {Math.round(totalTime)} minutes
              </div>
            )}
          </Col>

          <Col span={24}>
            <Form.Item name="comments" label="Comments">
              <TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="content" label="Content">
              <TextArea rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="is_new_learning" valuePropName="checked">
              <Checkbox>Is New Learning</Checkbox>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="is_redline" valuePropName="checked">
              <Checkbox>Redline</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ProjectModal
