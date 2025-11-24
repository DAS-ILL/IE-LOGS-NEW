import { useEffect, useState } from 'react'
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button, message, Space } from 'antd'
import dayjs from 'dayjs'
import { projectAPI, lookupAPI } from '../../services/api'
import { Project, ProjectFormData, LookupData } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { calculateHours, formatDateTime } from '../../utils/timezone'

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

  useEffect(() => {
    if (visible) {
      fetchLookupData()
      if (project) {
        // Populate form with project data
        form.setFieldsValue({
          application_number: project.application_number,
          account_name: project.account_name,
          project_court: project.project_court,
          reviewed_by: project.reviewed_by,
          project_status: project.project_status,
          start_time: project.start_time ? dayjs(project.start_time) : null,
          end_time: project.end_time ? dayjs(project.end_time) : null,
          partner_installer_account: project.partner_installer_account,
          third_party_salesforce: project.third_party_salesforce,
          comments: project.comments,
          content: project.content,
          is_new_learning: project.is_new_learning,
        })
        setStartTime(project.start_time ? dayjs(project.start_time) : null)
        setEndTime(project.end_time ? dayjs(project.end_time) : null)
      } else {
        form.resetFields()
        setStartTime(null)
        setEndTime(null)
      }
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
      const values = await form.validateFields()
      const formData: ProjectFormData = {
        ...values,
        start_time: values.start_time?.toISOString() || '',
        end_time: values.end_time?.toISOString() || '',
        id: project?.id,
      }
      
      await projectAPI.saveDraft(formData)
      message.success('Draft saved successfully')
      onClose(true)
    } catch (error: any) {
      if (error.errorFields) {
        message.error('Please fill in the required fields')
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
      const formData: ProjectFormData = {
        ...values,
        start_time: values.start_time?.toISOString() || '',
        end_time: values.end_time?.toISOString() || '',
        id: project?.id,
      }
      
      await projectAPI.submitProject(formData)
      message.success('Project submitted successfully')
      onClose(true)
    } catch (error: any) {
      if (error.errorFields) {
        message.error('Please fill in all required fields')
      } else {
        message.error('Failed to submit project')
      }
    } finally {
      setLoading(false)
    }
  }

  const canEdit = () => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (project && project.created_by !== user.id) return false
    if (project && project.stage === 'Completed') return false
    return true
  }

  const totalTime = startTime && endTime ? calculateHours(startTime, endTime) : 0

  return (
    <Modal
      title={project ? 'Edit Project' : 'New Project Entry'}
      open={visible}
      onCancel={() => onClose()}
      width={800}
      footer={
        canEdit() ? (
          <Space>
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button onClick={handleSaveDraft} loading={loading}>
              Save Draft
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Submit
            </Button>
          </Space>
        ) : (
          <Button onClick={() => onClose()}>Close</Button>
        )
      }
    >
      <Form form={form} layout="vertical" disabled={!canEdit()}>
        <Form.Item
          name="application_number"
          label="Application Number"
          rules={[{ required: true, message: 'Please enter application number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="account_name"
          label="Account Name"
          rules={[{ required: true, message: 'Please enter account name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="project_court"
          label="Project Court"
          rules={[{ required: true, message: 'Please select project court' }]}
        >
          <Select placeholder="Select court">
            {lookupData?.courts.map((court: any) => (
              <Option key={court} value={court}>
                {court}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="reviewed_by"
          label="Reviewed By"
          rules={[{ required: true, message: 'Please select reviewer' }]}
        >
          <Select placeholder="Select reviewer">
            {lookupData?.reviewers.map((reviewer: any) => (
              <Option key={reviewer} value={reviewer}>
                {reviewer}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="project_status"
          label="Project Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select placeholder="Select status">
            {lookupData?.statuses.map((status: any) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="start_time"
          label="Start Time"
          rules={[{ required: true, message: 'Please select start time' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            onChange={(value: any) => setStartTime(value)}
          />
        </Form.Item>

        <Form.Item name="end_time" label="End Time">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            onChange={(value: any) => setEndTime(value)}
          />
        </Form.Item>

        {totalTime > 0 && (
          <div style={{ marginBottom: 16 }}>
            <strong>Total Time:</strong> {totalTime.toFixed(2)} hours
          </div>
        )}

        <Form.Item name="partner_installer_account" label="Partner Installer Account">
          <Input />
        </Form.Item>

        <Form.Item name="third_party_salesforce" label="Third Party Salesforce">
          <Select placeholder="Select option">
            {lookupData?.third_party_options.map((option: any) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="comments" label="Comments">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="content" label="Content">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item name="is_new_learning" valuePropName="checked">
          <Checkbox>Is New Learning</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectModal
