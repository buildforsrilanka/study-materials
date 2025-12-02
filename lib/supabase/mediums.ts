import { createClient } from './server'
import type { Medium } from '@/types/database'

/**
 * Fetch all mediums ordered by name
 * Used in upload forms and filter dropdowns
 */
export async function getMediums(): Promise<Medium[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('mediums')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching mediums:', error)
    throw error
  }

  return data || []
}

/**
 * Get a single medium by ID
 */
export async function getMediumById(id: string): Promise<Medium | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('mediums')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching medium:', error)
    return null
  }

  return data
}
