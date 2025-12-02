'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteMaterial(id: string) {
    const supabase = await createClient()

    // TODO: Phase 2 - Replace with real auth check
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) throw new Error("Unauthorized")
    // const creatorId = user.id

    // Phase 1: Mock Creator ID
    const creatorId = '00000000-0000-0000-0000-000000000000'

    // Verify ownership before deleting
    const { data: material, error: fetchError } = await supabase
        .from('materials')
        .select('creator_id')
        .eq('id', id)
        .single()

    if (fetchError || !material) {
        throw new Error("Material not found")
    }

    if (material.creator_id !== creatorId) {
        throw new Error("Unauthorized: You can only delete your own materials")
    }

    const { error: deleteError } = await supabase
        .from('materials')
        .delete()
        .eq('id', id)

    if (deleteError) {
        throw new Error(`Failed to delete material: ${deleteError.message}`)
    }

    revalidatePath('/creator/dashboard')
}
