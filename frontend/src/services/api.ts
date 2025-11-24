import apiClient from '../utils/api'
import { User, Project, ProjectFormData, LookupData, FilterOptions, ExportParams } from '../types'

// Authentication APIs
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/api/auth/login/', { username, password })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout/')
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me/')
    return response.data
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/api/auth/users/')
    return response.data
  },

  createUser: async (userData: Partial<User> & { password: string }) => {
    const response = await apiClient.post('/api/auth/users/', userData)
    return response.data
  },
}

// Project APIs
export const projectAPI = {
  // Get user's own projects (My Projects)
  getMyProjects: async (params?: any): Promise<{ results: Project[]; count: number }> => {
    const response = await apiClient.get('/api/get-logs/', { params })
    return response.data
  },

  // Get team projects
  getTeamProjects: async (params?: any): Promise<{ results: Project[]; count: number }> => {
    const response = await apiClient.get('/api/get-team-projects/', { params })
    return response.data
  },

  // Get project details
  getProjectDetail: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/api/get-log/${id}/`)
    return response.data
  },

  // Save draft
  saveDraft: async (data: ProjectFormData): Promise<Project> => {
    const response = await apiClient.post('/api/save-log/', data)
    return response.data
  },

  // Submit project
  submitProject: async (data: ProjectFormData): Promise<Project> => {
    const response = await apiClient.post('/api/submit-log/', data)
    return response.data
  },

  // Update project
  updateProject: async (id: number, data: ProjectFormData): Promise<Project> => {
    const response = await apiClient.put(`/api/update-log/${id}/`, data)
    return response.data
  },

  // Delete project
  deleteProject: async (id: number) => {
    const response = await apiClient.delete(`/api/delete-log/${id}/`)
    return response.data
  },

  // Bulk delete
  bulkDelete: async (project_ids: number[]) => {
    const response = await apiClient.post('/api/bulk-delete/', { project_ids })
    return response.data
  },
}

// Lookup & Filter APIs
export const lookupAPI = {
  // Get lookup data for dropdowns
  getLookupData: async (): Promise<LookupData> => {
    const response = await apiClient.get('/api/lookup-data/')
    return response.data
  },

  // Get filter options for My Projects
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await apiClient.get('/api/filter-options/')
    return response.data
  },

  // Get filter options for Team Projects
  getTeamFilterOptions: async (): Promise<FilterOptions> => {
    const response = await apiClient.get('/api/team-filter-options/')
    return response.data
  },
}

// Export APIs
export const exportAPI = {
  // Export to Excel
  exportExcel: async (params: ExportParams) => {
    const response = await apiClient.post('/api/export-excel/', params, {
      responseType: 'blob',
    })
    return response.data
  },

  // Export to CSV
  exportCSV: async (params: ExportParams) => {
    const response = await apiClient.post('/api/export-csv/', params, {
      responseType: 'blob',
    })
    return response.data
  },
}
