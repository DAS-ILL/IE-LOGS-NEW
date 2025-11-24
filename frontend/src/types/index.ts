export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'user'
  team: string
  is_active: boolean
  created_at: string
}

export interface Project {
  id: number
  completed_date: string
  application_number: string
  account_name: string
  project_court: string
  reviewed_by: string
  project_status: 'Approve' | 'Conditional Approve' | 'Reject' | 'Review'
  stage: 'Started' | 'Completed'
  start_time: string
  end_time?: string
  total_time?: number
  partner_installer_account?: string
  third_party_salesforce?: 'YES' | 'NO'
  comments?: string
  content?: string
  is_new_learning: boolean
  is_redline: boolean
  created_by: number
  created_by_username: string
  created_by_detail: User
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface ProjectFormData {
  id?: number
  completed_date?: string // Optional - auto-set by backend on submit
  application_number: string
  account_name: string
  project_court: string
  reviewed_by: string
  project_status: 'Approve' | 'Conditional Approve' | 'Reject' | 'Review'
  stage?: 'Started' | 'Completed'
  start_time: string
  end_time?: string
  partner_installer_account?: string
  third_party_salesforce?: 'YES' | 'NO'
  comments?: string
  content?: string
  is_new_learning?: boolean
  is_redline?: boolean
}

export interface LookupData {
  courts: string[]
  reviewers: string[]
  statuses: string[]
  third_party_options: string[]
}

export interface FilterOptions {
  courts: string[]
  reviewers: string[]
  statuses: string[]
  stages: string[]
  creators?: { id: number; username: string }[]
}

export interface ProjectFilters {
  application_number?: string
  account_name?: string
  project_court?: string
  reviewed_by?: string
  project_status?: string
  stage?: string
  created_by?: number
  completed_date_from?: string
  completed_date_to?: string
}

export interface ExportParams {
  start_date?: string
  end_date?: string
  project_ids?: number[]
}
