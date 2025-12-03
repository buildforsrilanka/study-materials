import { getMaterials } from '@/lib/actions/materials'
import MaterialsTable from '@/components/student/MaterialsTable'
import Pagination from '@/components/Pagination'

interface MaterialsListProps {
    searchParams: {
        grade?: string
        medium?: string
        subject?: string
        type?: string
        page?: string
        limit?: string
    }
}

export default async function MaterialsList({ searchParams }: MaterialsListProps) {
    const page = Number(searchParams.page) || 1
    const limit = Number(searchParams.limit) || 10
    const { data: materials, totalPages } = await getMaterials({
        gradeId: searchParams.grade,
        mediumId: searchParams.medium,
        subjectId: searchParams.subject,
        type: searchParams.type,
        page,
        limit
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
        <div className="space-y-4">
            <MaterialsTable materials={formattedMaterials} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/student/browse"
                searchParams={searchParams}
                className="justify-end"
            />
        </div>
    )
}
