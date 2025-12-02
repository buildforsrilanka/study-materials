// Database types matching Supabase schema

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'creator' | 'student'
  created_at: string
  updated_at: string
}

export type Grade = {
  id: string
  name: string
  display_order: number
  created_at: string
}

export type Medium = {
  id: string
  name: string
  created_at: string
}

export type Subject = {
  id: string
  name: string
  created_at: string
}

export type Material = {
  id: string
  creator_id: string
  title: string
  description: string
  type: 'pdf' | 'youtube'
  url: string
  subject_id: string | null
  grade_id: string
  medium_id: string
  created_at: string
  updated_at: string
}

// Extended types with joined data
export type MaterialWithRelations = Material & {
  subjects: Subject | null
  grades: Grade
  mediums: Medium
}

// Form input types
export type MaterialFormData = {
  title: string
  description: string
  type: 'pdf' | 'youtube'
  url: string
  grade_id: string
  medium_id: string
  subject_id?: string
}
