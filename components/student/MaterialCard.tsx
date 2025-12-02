import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Youtube, ExternalLink } from "lucide-react"
import Link from "next/link"

// Define types locally for now since we don't have a shared type file for the joined query result yet
// In a real app, we should generate types from Supabase or define them in types/database.ts
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

interface MaterialCardProps {
    material: Material
}

export default function MaterialCard({ material }: MaterialCardProps) {
    const isPdf = material.type === 'pdf'
    const Icon = isPdf ? FileText : Youtube

    return (
        <Card className="h-full flex flex-col bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className={`w-6 h-6 ${isPdf ? 'text-red-500' : 'text-red-600'}`} />
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                        {material.subjects?.name || 'General'}
                    </Badge>
                </div>
                <CardTitle className="mt-4 text-lg font-semibold text-slate-900 line-clamp-2">
                    {material.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-slate-500">
                    {material.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {material.grades?.name}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                        {material.mediums?.name}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                    <Link href={material.url} target="_blank" rel="noopener noreferrer">
                        <span className="mr-2">View Material</span>
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
