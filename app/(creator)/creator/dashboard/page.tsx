import { createClient } from "@/lib/supabase/server"
import { getCreatorMaterials } from "@/lib/actions/materials"
import CreatorMaterialsTable from "@/components/creator/CreatorMaterialsTable"
import ItemsPerPageDropdown from "@/components/ItemsPerPageDropdown"
import TypeToggle from "@/components/TypeToggle"
import SearchInput from "@/components/SearchInput"
import CreatorMaterialsTableSkeleton from "@/components/creator/CreatorMaterialsTableSkeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Plus } from "lucide-react"
import BackButton from "@/components/BackButton"

interface DashboardPageProps {
    searchParams: Promise<{
        page?: string
        limit?: string
        type?: string
        search?: string
    }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const supabase = await createClient()

    // Phase 2: Real Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const creatorId = user.id

    const page = Number((await searchParams).page) || 1
    const limit = Number((await searchParams).limit) || 10
    const type = (await searchParams).type
    const search = (await searchParams).search
    const { data: materials, totalPages } = await getCreatorMaterials(page, limit, type, search)

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

            <div className="flex justify-between items-center mb-4">
                <SearchInput />
                <div className="flex items-center gap-6">
                    <ItemsPerPageDropdown />
                    <TypeToggle />
                </div>
            </div>

            <Suspense fallback={<CreatorMaterialsTableSkeleton />}>
                <CreatorMaterialsTable
                    materials={formattedMaterials as any}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </Suspense>
        </div>
    )
}
