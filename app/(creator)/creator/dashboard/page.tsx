import { createClient } from "@/lib/supabase/server"
import CreatorMaterialsTable from "@/components/creator/CreatorMaterialsTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import BackButton from "@/components/BackButton"

export default async function DashboardPage() {
    const supabase = await createClient()

    // TODO: Phase 2 - Replace with real auth check
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) redirect('/login')
    // const creatorId = user.id

    // Phase 1: Mock Creator ID
    const creatorId = '00000000-0000-0000-0000-000000000000'

    const { data: materials, error } = await supabase
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
        `)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching materials:", error)
        return <div>Error loading materials</div>
    }

    // Transform the data to match the expected type
    // Supabase returns arrays for joined tables if not using single(), but our types expect objects
    // Since we're using foreign keys that are NOT NULL, we can safely assume data exists
    const formattedMaterials = materials?.map(m => ({
        ...m,
        grades: Array.isArray(m.grades) ? m.grades[0] : m.grades,
        mediums: Array.isArray(m.mediums) ? m.mediums[0] : m.mediums,
        subjects: Array.isArray(m.subjects) ? m.subjects[0] : m.subjects,
    })) || []

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6">
                <BackButton href="/" label="Back to Home" />
            </div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Creator Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your uploaded study materials.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/creator/upload">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Material
                    </Link>
                </Button>
            </div>

            <CreatorMaterialsTable materials={formattedMaterials as any} />
        </div>
    )
}
