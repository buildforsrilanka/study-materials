import { getMaterials } from '@/lib/actions/materials'
import MaterialsGrid from '@/components/student/MaterialsGrid'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BrowsePage() {
    const materials = await getMaterials()

    // Cast the data to match the component's expected type
    // In a real app, we'd have shared types to avoid this
    const formattedMaterials = materials.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        type: m.type as 'pdf' | 'youtube',
        url: m.url,
        created_at: m.created_at,
        grades: m.grades,
        mediums: m.mediums,
        subjects: m.subjects
    }))

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Browse Materials</h1>
                    <p className="text-slate-500">
                        Find study materials for your grade and subject.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                }>
                    <MaterialsGrid materials={formattedMaterials} />
                </Suspense>
            </div>
        </div>
    )
}
