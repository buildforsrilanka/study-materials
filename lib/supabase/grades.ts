import { createClient } from './server'
import type { Grade } from '@/types/database'

/**
 * Fetch all grades ordered by display_order
 * Used in upload forms and filter dropdowns
 */
export async function getGrades(): Promise<Grade[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching grades:', error)
    throw error
  }

  return data || []
}

/**
 * Get a single grade by ID
 */
export async function getGradeById(id: string): Promise<Grade | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching grade:', error)
    return null
  }

  return data
}
