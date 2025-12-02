import MaterialCard from "./MaterialCard"

// Reusing the type from MaterialCard for now
type Material = {
    id: string
    title: string
    description: string
    type: 'pdf' | 'youtube'
    url: string
    created_at: string
    grades: { name: string } | null
    mediums: { name: string } | null
    subjects: { name: string } | null
}

interface MaterialsGridProps {
    materials: Material[]
}

export default function MaterialsGrid({ materials }: MaterialsGridProps) {
    if (materials.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No materials found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
            ))}
        </div>
    )
}
