import { getFormOptions } from '@/lib/actions/materials'
import MaterialsTable from '@/components/student/MaterialsTable'
import FilterSidebar from '@/components/student/FilterSidebar'
import TypeToggle from '@/components/TypeToggle'
import MaterialsList from '@/components/student/MaterialsList'
import MaterialsTableSkeleton from '@/components/student/MaterialsTableSkeleton'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import BackButton from '@/components/BackButton'
import SidebarPagination from '@/components/student/SidebarPagination'
import ItemsPerPageDropdown from '@/components/ItemsPerPageDropdown'

export const dynamic = 'force-dynamic'

interface BrowsePageProps {
    searchParams: Promise<{
        grade?: string
        medium?: string
        subject?: string
        type?: string
        page?: string
        limit?: string
    }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
    const resolvedParams = await searchParams
    const options = await getFormOptions()

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="space-y-8">
                <div className="space-y-2">
                    <BackButton href="/" label="Back to Home" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Browse Materials</h1>
                    <p className="text-slate-500">
                        Find study materials for your grade and subject.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                    <div>
                        <FilterSidebar
                            grades={options.grades}
                            mediums={options.mediums}
                            subjects={options.subjects}
                        />
                        <div className="mt-6">
                            <SidebarPagination searchParams={resolvedParams} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1 h-9">
                            <ItemsPerPageDropdown />
                            <TypeToggle />
                        </div>
                        <Suspense fallback={<MaterialsTableSkeleton />}>
                            <MaterialsList searchParams={resolvedParams} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}
