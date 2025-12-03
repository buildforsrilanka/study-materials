import { getMaterials } from '@/lib/actions/materials'
import Pagination from '@/components/Pagination'

interface SidebarPaginationProps {
    searchParams: {
        grade?: string
        medium?: string
        subject?: string
        type?: string
        page?: string
        limit?: string
    }
}

export default async function SidebarPagination({ searchParams }: SidebarPaginationProps) {
    const page = Number(searchParams.page) || 1
    const limit = Number(searchParams.limit) || 10
    const { totalPages } = await getMaterials({
        gradeId: searchParams.grade,
        mediumId: searchParams.medium,
        subjectId: searchParams.subject,
        type: searchParams.type,
        page,
        limit
    })

    if (totalPages <= 1) return null

    return (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/student/browse"
            searchParams={searchParams}
            compact
        />
    )
}
