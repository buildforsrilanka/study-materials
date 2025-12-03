'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const materialSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['pdf', 'youtube']),
  url: z.string().url('Invalid URL'),
  grade_id: z.string().uuid('Invalid grade'),
  medium_id: z.string().uuid('Invalid medium'),
  subject_id: z.string().uuid('Invalid subject'),
})

export type MaterialFormState = {
  errors?: {
    title?: string[]
    description?: string[]
    url?: string[]
    grade_id?: string[]
    medium_id?: string[]
    subject_id?: string[]
    _form?: string[]
  }
  message?: string
  success?: boolean
} | null

export async function createMaterial(prevState: MaterialFormState, formData: FormData): Promise<MaterialFormState> {
  const validatedFields = materialSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    url: formData.get('url'),
    grade_id: formData.get('grade_id'),
    medium_id: formData.get('medium_id'),
    subject_id: formData.get('subject_id'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Material.',
    }
  }

  const { title, description, type, url, grade_id, medium_id, subject_id } = validatedFields.data

  // Additional validation based on type
  if (type === 'pdf') {
    if (!url.includes('drive.google.com')) {
      return {
        errors: { url: ['Must be a valid Google Drive link'] },
        message: 'Invalid URL for PDF material',
      }
    } else if (url.includes('/folders/')) {
      return {
        errors: { url: ['Must be a file link, not a folder link'] },
        message: 'Invalid URL: Folders are not allowed',
      }
    }
  } else if (type === 'youtube') {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return {
        errors: { url: ['Must be a valid YouTube link'] },
        message: 'Invalid URL for YouTube material',
      }
    } else if (url.includes('list=')) {
      return {
        errors: { url: ['Must be a video link, not a playlist'] },
        message: 'Invalid URL: Playlists are not allowed',
      }
    }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  let creator_id = user?.id

  if (!creator_id) {
    return {
      message: 'You must be logged in to create materials.',
    }
  }

  try {
    const { error } = await supabase.from('materials').insert({
      title,
      description,
      type,
      url,
      grade_id,
      medium_id,
      subject_id,
      creator_id,
    })

    if (error) {
      console.error('Database Error:', error)
      return {
        message: 'Database Error: Failed to Create Material.',
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      message: 'Failed to Create Material.',
    }
  }

  revalidatePath('/creator/dashboard')
  return { success: true, message: 'Material created successfully' }
}

export async function updateMaterial(id: string, prevState: MaterialFormState, formData: FormData): Promise<MaterialFormState> {
  const validatedFields = materialSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    type: formData.get('type'),
    url: formData.get('url'),
    grade_id: formData.get('grade_id'),
    medium_id: formData.get('medium_id'),
    subject_id: formData.get('subject_id'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Material.',
    }
  }

  const { title, description, type, url, grade_id, medium_id, subject_id } = validatedFields.data

  // Additional validation based on type
  if (type === 'pdf') {
    if (!url.includes('drive.google.com')) {
      return {
        errors: { url: ['Must be a valid Google Drive link'] },
        message: 'Invalid URL for PDF material',
      }
    } else if (url.includes('/folders/')) {
      return {
        errors: { url: ['Must be a file link, not a folder link'] },
        message: 'Invalid URL: Folders are not allowed',
      }
    }
  } else if (type === 'youtube') {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return {
        errors: { url: ['Must be a valid YouTube link'] },
        message: 'Invalid URL for YouTube material',
      }
    } else if (url.includes('list=')) {
      return {
        errors: { url: ['Must be a video link, not a playlist'] },
        message: 'Invalid URL: Playlists are not allowed',
      }
    }
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  let creator_id = user?.id

  // Phase 2: Real Auth
  if (!creator_id) {
    return {
      message: 'You must be logged in to update materials.',
    }
  }

  // Verify ownership
  const { data: existingMaterial } = await supabase
    .from('materials')
    .select('creator_id')
    .eq('id', id)
    .single()

  if (!existingMaterial) {
    return { message: 'Material not found' }
  }

  if (existingMaterial.creator_id !== creator_id) {
    return { message: 'Unauthorized: You can only update your own materials' }
  }

  try {
    const { error } = await supabase
      .from('materials')
      .update({
        title,
        description,
        type,
        url,
        grade_id,
        medium_id,
        subject_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Database Error:', error)
      return {
        message: 'Database Error: Failed to Update Material.',
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      message: 'Failed to Update Material.',
    }
  }

  revalidatePath('/creator/dashboard')
  return { success: true, message: 'Material updated successfully' }
}

export async function getFormOptions() {
  const supabase = await createClient()

  const [grades, mediums, subjects] = await Promise.all([
    supabase.from('grades').select('id, name').order('display_order'),
    supabase.from('mediums').select('id, name').order('name'),
    supabase.from('subjects').select('id, name').order('name'),
  ])

  return {
    grades: grades.data || [],
    mediums: mediums.data || [],
    subjects: subjects.data || [],
  }
}

export async function getMaterials(filters?: {
  gradeId?: string
  mediumId?: string
  subjectId?: string
  type?: string
  page?: number
  limit?: number
}) {
  const supabase = await createClient()
  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('materials')
    .select(`
      *,
      grades (id, name),
      mediums (id, name),
      subjects (id, name)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters?.gradeId) {
    query = query.eq('grade_id', filters.gradeId)
  }
  if (filters?.mediumId) {
    query = query.eq('medium_id', filters.mediumId)
  }
  if (filters?.subjectId) {
    query = query.eq('subject_id', filters.subjectId)
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Error fetching materials:', error)
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  return {
    data: data || [],
    totalCount: count || 0,
    totalPages: count ? Math.ceil(count / limit) : 0
  }
}

export async function getCreatorMaterials(page: number = 1, limit: number = 10, type?: string) {
  const supabase = await createClient()

  // Phase 2: Real Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], totalCount: 0, totalPages: 0 }

  const creatorId = user.id
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('materials')
    .select(`
        id,
        title,
        description,
        type,
        url,
        created_at,
        grades (name),
        mediums (name),
        subjects (name)
    `, { count: 'exact' })
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })

  if (type && type !== 'all') {
    query = query.eq('type', type)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error("Error fetching materials:", error)
    return { data: [], totalCount: 0, totalPages: 0 }
  }

  return {
    data: data || [],
    totalCount: count || 0,
    totalPages: count ? Math.ceil(count / limit) : 0
  }
}
