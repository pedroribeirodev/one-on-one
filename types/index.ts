// User types
export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Developer types
export interface Developer {
  id: string
  user_id: string
  name: string
  email: string
  role: string
  department: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Meeting types
export interface Meeting {
  id: string
  developer_id: string
  user_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string | null
  action_items: ActionItem[]
  created_at: string
  updated_at: string
}

// Action Item types
export interface ActionItem {
  id: string
  meeting_id: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  created_at: string
  updated_at: string
}

// API Response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  name: string
}

export interface DeveloperFormData {
  name: string
  email: string
  role: string
  department?: string
}

export interface MeetingFormData {
  developer_id: string
  scheduled_at: string
  duration_minutes: number
  notes?: string
}
