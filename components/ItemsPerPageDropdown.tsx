'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function ItemsPerPageDropdown() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentLimit = searchParams.get('limit') || '10'

    const handleLimitChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('limit', value)
        params.set('page', '1') // Reset to first page when limit changes
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={currentLimit} onValueChange={handleLimitChange}>
                <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={currentLimit} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
