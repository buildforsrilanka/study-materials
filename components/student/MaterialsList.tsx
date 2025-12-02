import { getMaterials } from '@/lib/actions/materials'
import MaterialsTable from '@/components/student/MaterialsTable'

interface MaterialsListProps {
    searchParams: {
        grade?: string
        medium?: string
        subject?: string
        type?: string
    }
}

export default async function MaterialsList({ searchParams }: MaterialsListProps) {
    const materials = await getMaterials({
        gradeId: searchParams.grade,
        mediumId: searchParams.medium,
        subjectId: searchParams.subject,
        type: searchParams.type
    })

    // Cast the data to match the component's expected type
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
        <MaterialsTable materials={formattedMaterials} />
    )
}
