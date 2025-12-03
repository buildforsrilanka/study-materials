'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, FileText, Youtube } from "lucide-react"

export default function TypeToggle() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentType = searchParams.get('type') || 'all'

    const updateType = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'all') {
            params.set('type', value)
        } else {
            params.delete('type')
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Tabs value={currentType} onValueChange={updateType} className="w-fit">
            <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="all" className="text-xs px-3 cursor-pointer">
                    <LayoutGrid className="w-3.5 h-3.5 mr-2" />
                    All
                </TabsTrigger>
                <TabsTrigger value="pdf" className="px-3 cursor-pointer" title="PDF">
                    <FileText className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="youtube" className="px-3 cursor-pointer" title="YouTube">
                    <Youtube className="w-4 h-4" />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
