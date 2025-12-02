import { createClient } from "@/lib/supabase/server"
import { getFormOptions } from "@/lib/actions/materials"
import UploadForm from "@/components/creator/UploadForm"
import { notFound, redirect } from "next/navigation"

interface EditMaterialPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
    const { id } = await params
    const supabase = await createClient()

    // TODO: Phase 2 - Replace with real auth check
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) redirect('/login')
    // const creatorId = user.id

    // Phase 1: Mock Creator ID
    const creatorId = '00000000-0000-0000-0000-000000000000'

    // Fetch material
    const { data: material, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !material) {
        notFound()
    }

    // Verify ownership
    if (material.creator_id !== creatorId) {
        // In a real app, show 403 or redirect
        redirect('/creator/dashboard')
    }

    // Fetch options
    const { grades, mediums, subjects } = await getFormOptions()

    return (
        <div className="container mx-auto py-10 px-4">
            <UploadForm
                grades={grades}
                mediums={mediums}
                subjects={subjects}
                initialData={material}
                materialId={id}
            />
        </div>
    )
}
