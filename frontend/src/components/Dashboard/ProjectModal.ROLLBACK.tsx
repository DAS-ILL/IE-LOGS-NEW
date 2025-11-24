import { useEffect, useState } from 'react'
import { Modal, Form, Input, DatePicker, Select, Checkbox, Button, message, Space, Spin } from 'antd'
import dayjs from 'dayjs'
import { projectAPI, lookupAPI } from '../../services/api'
import { Project, ProjectFormData, LookupData } from '../../types'
import { useAuthStore } from '../../store/authStore'

const { TextArea } = Input

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
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [hasStartTimeSet, setHasStartTimeSet] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsLoadingData(true)
      fetchLookupData()
      
      if (project) {
        // Populate form with project data (editing existing project)
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
      } else {
        // New project - reset form
        form.resetFields()
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

  // Auto-fill start_time when application_number is first entered
  const handleApplicationNumberChange = (e: any) => {
    const value = e.target.value
    if (value && !hasStartTimeSet && !project) {
      // New project and first time entering application number
      const currentTime = dayjs()
      form.setFieldValue('start_time', currentTime)
      setHasStartTimeSet(true)
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
      setTimeout(() => onClose(true), 500)
    } catch (error: any) {
      console.error('Save draft error:', error)
      message.error('Failed to save draft')
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
      setTimeout(() => onClose(true), 500)
    } catch (error: any) {
      console.error('Submit error:', error)
      message.error('Failed to submit project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={project ? 'Edit Project' : 'New Project Entry'}
      open={visible}
      onCancel={() => onClose(false)}
      width={900}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Cancel
        </Button>,
        <Button key="draft" onClick={handleSaveDraft} loading={loading}>
          Save Draft
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Submit
        </Button>,
      ]}
    >
      <Spin spinning={isLoadingData}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Application Number"
            name="application_number"
            rules={[{ required: true, message: 'Application number is required' }]}
          >
            <Input 
              placeholder="Enter application number"
              onChange={handleApplicationNumberChange}
            />
          </Form.Item>

          <Form.Item
            label="Account Name"
            name="account_name"
            rules={[{ required: true, message: 'Account name is required' }]}
          >
            <Input placeholder="Enter account name" />
          </Form.Item>

          <Form.Item
            label="Project Court"
            name="project_court"
            rules={[{ required: true, message: 'Project court is required' }]}
          >
            <Select placeholder="Select court">
              {lookupData?.courts.map((court) => (
                <Select.Option key={court} value={court}>
                  {court}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Reviewed By"
            name="reviewed_by"
            rules={[{ required: true, message: 'Reviewer is required' }]}
          >
            <Select placeholder="Select reviewer">
              {lookupData?.reviewers.map((reviewer) => (
                <Select.Option key={reviewer} value={reviewer}>
                  {reviewer}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Project Status"
            name="project_status"
            rules={[{ required: true, message: 'Project status is required' }]}
          >
            <Select placeholder="Select status">
              {lookupData?.statuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true, message: 'Start time is required' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="end_time"
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            label="Partner Installer Account"
            name="partner_installer_account"
          >
            <Input placeholder="Enter partner installer account" />
          </Form.Item>

          <Form.Item
            label="Third Party Salesforce"
            name="third_party_salesforce"
          >
            <Select placeholder="Select option">
              <Select.Option value="YES">YES</Select.Option>
              <Select.Option value="NO">NO</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
          >
            <TextArea rows={3} placeholder="Enter comments" />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
          >
            <TextArea rows={3} placeholder="Enter content" />
          </Form.Item>

          <Form.Item
            label="Is New Learning?"
            name="is_new_learning"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ProjectModal
