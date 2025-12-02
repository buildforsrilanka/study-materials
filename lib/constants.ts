// =============================================
// APP CONSTANTS
// =============================================

// NOTE: Grades and Mediums are now stored in the database
// Fetch them using:
// - getGrades() from lib/supabase/grades.ts
// - getMediums() from lib/supabase/mediums.ts

export const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'youtube', label: 'YouTube Video' },
] as const

// Mock creator ID for development (no auth yet)
// This profile exists in the database after running supabase-schema.sql
export const MOCK_CREATOR_ID = '00000000-0000-0000-0000-000000000000'
