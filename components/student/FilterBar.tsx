'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

type Option = {
    id: string
    name: string
}

interface FilterBarProps {
    grades: Option[]
    mediums: Option[]
    subjects: Option[]
}

export default function FilterBar({ grades, mediums, subjects }: FilterBarProps) {
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
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Grade</label>
                        <Select value={currentGrade} onValueChange={(val) => updateFilter('grade', val)}>
                            <SelectTrigger>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Medium</label>
                        <Select value={currentMedium} onValueChange={(val) => updateFilter('medium', val)}>
                            <SelectTrigger>
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Subject</label>
                        <Select value={currentSubject} onValueChange={(val) => updateFilter('subject', val)}>
                            <SelectTrigger>
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

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="text-slate-500 hover:text-slate-900"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    )
}
