'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Filter } from "lucide-react"

type Option = {
    id: string
    name: string
}

interface FilterSidebarProps {
    grades: Option[]
    mediums: Option[]
    subjects: Option[]
}

export default function FilterSidebar({ grades, mediums, subjects }: FilterSidebarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentGrade = searchParams.get('grade') || ''
    const currentMedium = searchParams.get('medium') || ''
    const currentSubject = searchParams.get('subject') || ''

    const hasActiveFilters = currentGrade || currentMedium || currentSubject

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push(pathname)
    }

    return (
        <div className="space-y-4 sticky top-4">
            <div className="flex items-center justify-between px-1 h-9">
                <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </h3>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-6 px-2 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Medium</label>
                    <Select value={currentMedium} onValueChange={(val) => updateFilter('medium', val)}>
                        <SelectTrigger className="w-full h-9 text-sm cursor-pointer">
                            <SelectValue placeholder="All Mediums" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Mediums</SelectItem>
                            {mediums.map((medium) => (
                                <SelectItem key={medium.id} value={medium.id}>
                                    {medium.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</label>
                    <Select value={currentGrade} onValueChange={(val) => updateFilter('grade', val)}>
                        <SelectTrigger className="w-full h-9 text-sm cursor-pointer">
                            <SelectValue placeholder="All Grades" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Grades</SelectItem>
                            {grades.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id}>
                                    {grade.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</label>
                    <Select value={currentSubject} onValueChange={(val) => updateFilter('subject', val)}>
                        <SelectTrigger className="w-full h-9 text-sm cursor-pointer">
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
