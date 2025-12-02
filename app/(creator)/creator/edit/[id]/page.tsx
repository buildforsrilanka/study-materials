import { createClient } from "@/lib/supabase/server"
import { getFormOptions } from "@/lib/actions/materials"
import UploadForm from "@/components/creator/UploadForm"
import BackButton from "@/components/BackButton"
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

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
    if (material.creator_id !== user.id) {
        // In a real app, show 403 or redirect
        redirect('/creator/dashboard')
    }

    // Fetch options
    const { grades, mediums, subjects } = await getFormOptions()

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <BackButton href="/creator/dashboard" />
                </div>
                <UploadForm
                    grades={grades}
                    mediums={mediums}
                    subjects={subjects}
                    initialData={material}
                    materialId={id}
                />
            </div>
        </div>
    )
}
