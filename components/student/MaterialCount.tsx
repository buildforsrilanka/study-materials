import { getMaterials } from '@/lib/actions/materials'

interface MaterialCountProps {
    searchParams: {
        grade?: string
        medium?: string
        subject?: string
        type?: string
    }
}

export default async function MaterialCount({ searchParams }: MaterialCountProps) {
    const materials = await getMaterials({
        gradeId: searchParams.grade,
        mediumId: searchParams.medium,
        subjectId: searchParams.subject,
        type: searchParams.type
    })

    return (
        <h3 className="font-semibold text-sm text-slate-900">
            {materials.length} Materials
        </h3>
    )
}
