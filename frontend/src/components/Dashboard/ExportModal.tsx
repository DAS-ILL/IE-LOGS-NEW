import { useState } from 'react'
import { Modal, Form, DatePicker, Button, message, Radio, Space } from 'antd'
import { exportAPI } from '../../services/api'
import dayjs, { Dayjs } from 'dayjs'

interface ExportModalProps {
  visible: boolean
  onClose: () => void
}

const ExportModal = ({ visible, onClose }: ExportModalProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel')

  const setDateRange = (startDate: Dayjs, endDate: Dayjs) => {
    form.setFieldsValue({
      start_date: startDate,
      end_date: endDate,
    })
  }

  const handleExport = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const params = {
        start_date: values.start_date?.format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.end_date?.format('YYYY-MM-DD HH:mm:ss'),
      }

      const blob = exportFormat === 'excel' 
        ? await exportAPI.exportExcel(params)
        : await exportAPI.exportCSV(params)

      // Download file
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ie_logs_export_${dayjs().format('YYYYMMDD_HHmmss')}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()

      message.success('Export successful!')
      onClose()
    } catch (error: any) {
      message.error('Failed to export projects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Export Projects"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="export" type="primary" onClick={handleExport} loading={loading}>
          Export
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Export Format">
          <Radio.Group
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <Radio value="excel">Excel (.xlsx)</Radio>
            <Radio value="csv">CSV (.csv)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Quick Date Range">
          <Space wrap>
            <Button 
              size="small" 
              onClick={() => setDateRange(dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month'))}
            >
              Last Month
            </Button>
            <Button 
              size="small" 
              onClick={() => setDateRange(dayjs().subtract(3, 'month'), dayjs())}
            >
              Last 3 Months
            </Button>
            <Button 
              size="small" 
              onClick={() => setDateRange(dayjs().subtract(6, 'month'), dayjs())}
            >
              Last 6 Months
            </Button>
          </Space>
        </Form.Item>

        <Form.Item name="start_date" label="Start Date & Time">
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm" 
            style={{ width: '100%' }} 
          />
        </Form.Item>

        <Form.Item name="end_date" label="End Date & Time">
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm" 
            style={{ width: '100%' }} 
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ExportModal
