'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
})

export type AuthFormState = {
    errors?: {
        email?: string[]
        password?: string[]
        fullName?: string[]
        _form?: string[]
    }
    message?: string
    success?: boolean
} | null

export async function login(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = authSchema.pick({ email: true, password: true }).safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid inputs.',
        }
    }

    const { email, password } = validatedFields.data
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return {
            message: error.message,
        }
    }

    revalidatePath('/', 'layout')
    redirect('/creator/dashboard')
}

export async function signup(prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
    const validatedFields = authSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('fullName'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid inputs.',
        }
    }

    const { email, password, fullName } = validatedFields.data
    const supabase = await createClient()

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'creator', // Force creator role for now
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        return {
            message: error.message,
        }
    }

    // Profile creation is now handled by the database trigger 'on_auth_user_created'

    return {
        success: true,
        message: 'Check your email to confirm your account.',
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
