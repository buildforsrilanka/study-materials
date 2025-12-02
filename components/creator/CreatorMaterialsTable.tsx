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
import { FileText, Youtube, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import DeleteMaterialButton from "./DeleteMaterialButton"

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

interface CreatorMaterialsTableProps {
    materials: Material[]
}

export default function CreatorMaterialsTable({ materials }: CreatorMaterialsTableProps) {
    if (materials.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-muted-foreground text-lg">No materials found.</p>
                <p className="text-sm text-muted-foreground mt-1">Upload your first material to get started.</p>
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
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer" asChild>
                                            <Link href={`/creator/edit/${material.id}`}>
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Link>
                                        </Button>
                                        <DeleteMaterialButton
                                            materialId={material.id}
                                            materialTitle={material.title}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
