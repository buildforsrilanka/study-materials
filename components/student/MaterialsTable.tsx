'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Youtube, ExternalLink, Play } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PDFViewer from "./PDFViewer"

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

interface MaterialsTableProps {
    materials: Material[]
}

export default function MaterialsTable({ materials }: MaterialsTableProps) {
    if (materials.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-muted-foreground text-lg">No materials found.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Medium</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materials.map((material) => {
                        const isPdf = material.type === 'pdf'
                        const Icon = isPdf ? FileText : Youtube

                        return (
                            <TableRow key={material.id}>
                                <TableCell>
                                    <div className="p-2 bg-slate-100 rounded-lg w-fit">
                                        <Icon className={`w-4 h-4 ${isPdf ? 'text-red-500' : 'text-red-600'}`} />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="line-clamp-1">{material.title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{material.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-normal">
                                        {material.subjects?.name || 'General'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-normal">
                                        {material.grades?.name}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 font-normal">
                                        {material.mediums?.name}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {isPdf ? (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="h-8 w-24 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">
                                                    <span className="mr-2">View</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-[90vw] max-w-none h-[90vh] flex flex-col p-0 gap-0">
                                                <DialogHeader className="p-4 border-b">
                                                    <DialogTitle>{material.title}</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex-1 overflow-hidden p-4 bg-slate-50">
                                                    <PDFViewer url={material.url} />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button asChild size="sm" className="h-8 w-24 bg-slate-900 hover:bg-slate-800 text-white" disabled={!material.url}>
                                            <Link href={material.url} target="_blank" rel="noopener noreferrer">
                                                <Play className="w-3 h-3 mr-2" />
                                                <span>Watch</span>
                                            </Link>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
