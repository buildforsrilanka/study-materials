import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
    searchParams?: Record<string, string | undefined>
    compact?: boolean
    className?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {}, compact = false, className }: PaginationProps) {
    if (totalPages <= 1) return null

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams()
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && key !== 'page') {
                params.set(key, value)
            }
        })
        if (page > 1) {
            params.set('page', page.toString())
        }
        const queryString = params.toString()
        return `${baseUrl}${queryString ? `?${queryString}` : ''}`
    }

    const renderPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                        "w-9 h-9",
                        currentPage === i ? "bg-slate-900 hover:bg-slate-800 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                    asChild
                >
                    <Link href={createPageUrl(i)}>
                        {i}
                    </Link>
                </Button>
            )
        }
        return pages
    }

    if (compact) {
        return (
            <div className="flex items-center justify-between w-full bg-white p-4 border rounded-lg shadow-sm">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage <= 1}
                    asChild={currentPage > 1}
                >
                    {currentPage > 1 ? (
                        <Link href={createPageUrl(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous</span>
                        </Link>
                    ) : (
                        <span>
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous</span>
                        </span>
                    )}
                </Button>

                <span className="text-sm text-muted-foreground font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={currentPage >= totalPages}
                    asChild={currentPage < totalPages}
                >
                    {currentPage < totalPages ? (
                        <Link href={createPageUrl(currentPage + 1)}>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next</span>
                        </Link>
                    ) : (
                        <span>
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next</span>
                        </span>
                    )}
                </Button>
            </div>
        )
    }

    return (
        <div className={cn("flex items-center justify-center space-x-2 mt-8", className)}>
            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous Page</span>
                    </span>
                )}
            </Button>

            {renderPageNumbers()}

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageUrl(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                    </Link>
                ) : (
                    <span>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next Page</span>
                    </span>
                )}
            </Button>
        </div>
    )
}
