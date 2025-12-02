'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createMaterial, updateMaterial } from '@/lib/actions/materials'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, FileText, Youtube } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Schema for client-side validation
const formSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    type: z.enum(['pdf', 'youtube']),
    url: z.string().url('Invalid URL'),
    grade_id: z.string().uuid('Please select a grade'),
    medium_id: z.string().uuid('Please select a medium'),
    subject_id: z.string().uuid('Please select a subject'),
}).superRefine((data, ctx) => {
    if (data.type === 'pdf') {
        if (!data.url.includes('drive.google.com')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be a valid Google Drive link',
                path: ['url'],
            })
        } else if (data.url.includes('/folders/')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be a file link, not a folder link',
                path: ['url'],
            })
        }
    }
    if (data.type === 'youtube') {
        if (!data.url.includes('youtube.com') && !data.url.includes('youtu.be')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be a valid YouTube link',
                path: ['url'],
            })
        } else if (data.url.includes('list=')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must be a video link, not a playlist',
                path: ['url'],
            })
        }
    }
})

type FormData = z.infer<typeof formSchema>

type Option = {
    id: string
    name: string
}

interface UploadFormProps {
    grades: Option[]
    mediums: Option[]
    subjects: Option[]
    initialData?: {
        title: string
        description: string
        type: 'pdf' | 'youtube'
        url: string
        grade_id: string
        medium_id: string
        subject_id: string
    }
    materialId?: string
}

export default function UploadForm({ grades, mediums, subjects, initialData, materialId }: UploadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'pdf' | 'youtube'>(initialData?.type || 'pdf')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: initialData?.type || 'pdf',
            title: initialData?.title || '',
            description: initialData?.description || '',
            url: initialData?.url || '',
            grade_id: initialData?.grade_id || '',
            medium_id: initialData?.medium_id || '',
            subject_id: initialData?.subject_id || '',
        },
    })

    // Watch type to update validation logic if needed, though superRefine handles it
    const currentType = watch('type')

    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setSubmitError(null)

        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
        })

        try {
            let result;
            if (materialId) {
                result = await updateMaterial(materialId, null, formData)
            } else {
                result = await createMaterial(null, formData)
            }

            if (result?.errors) {
                // Handle server-side errors
                setSubmitError(result.message || 'Validation failed')
            } else if (result?.message && !result.success) {
                setSubmitError(result.message)
            } else if (result?.success) {
                // Success
                if (!materialId) reset()
                router.push('/creator/dashboard')
            }
        } catch (error) {
            setSubmitError('An unexpected error occurred')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleTabChange = (value: string) => {
        const type = value as 'pdf' | 'youtube'
        setActiveTab(type)
        setValue('type', type)
        // Clear URL error when switching types
    }

    const isEditing = !!materialId

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white text-slate-900 border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900">
                    {isEditing ? 'Edit Learning Material' : 'Add Learning Material'}
                </CardTitle>
                <CardDescription className="text-slate-500">
                    {isEditing
                        ? 'Update the details of your learning material.'
                        : 'Share educational content with students. You can add PDF documents via Google Drive or YouTube videos.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {submitError && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="pdf" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                PDF Document
                            </TabsTrigger>
                            <TabsTrigger value="youtube" className="flex items-center gap-2">
                                <Youtube className="w-4 h-4" />
                                YouTube Video
                            </TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-slate-900">Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Introduction to Calculus"
                                    {...register('title')}
                                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-slate-900">Description <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Briefly describe the content..."
                                    {...register('description')}
                                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url" className="text-slate-900">
                                    {activeTab === 'pdf' ? 'Google Drive Link' : 'YouTube Video Link'} <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="url"
                                    placeholder={activeTab === 'pdf' ? 'https://drive.google.com/file/d/...' : 'https://youtube.com/watch?v=...'}
                                    {...register('url')}
                                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
                                <p className="text-xs text-slate-500">
                                    {activeTab === 'pdf'
                                        ? 'Make sure the Google Drive link is set to "Anyone with the link can view".'
                                        : 'Paste the full YouTube video URL.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="grade" className="text-slate-900">Grade <span className="text-red-500">*</span></Label>
                                    <Select
                                        onValueChange={(value) => setValue('grade_id', value, { shouldValidate: true })}
                                        defaultValue={initialData?.grade_id}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                                            <SelectValue placeholder="Select Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade.id} value={grade.id}>
                                                    {grade.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.grade_id && <p className="text-sm text-red-500">{errors.grade_id.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="medium" className="text-slate-900">Medium <span className="text-red-500">*</span></Label>
                                    <Select
                                        onValueChange={(value) => setValue('medium_id', value, { shouldValidate: true })}
                                        defaultValue={initialData?.medium_id}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                                            <SelectValue placeholder="Select Medium" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mediums.map((medium) => (
                                                <SelectItem key={medium.id} value={medium.id}>
                                                    {medium.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.medium_id && <p className="text-sm text-red-500">{errors.medium_id.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-slate-900">Subject <span className="text-red-500">*</span></Label>
                                    <Select
                                        onValueChange={(value) => setValue('subject_id', value, { shouldValidate: true })}
                                        defaultValue={initialData?.subject_id}
                                    >
                                        <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.id}>
                                                    {subject.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id.message}</p>}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isEditing ? 'Updating Material...' : 'Adding Material...'}
                                </>
                            ) : (
                                isEditing ? 'Update Material' : 'Add Material'
                            )}
                        </Button>
                    </Tabs>
                </form>
            </CardContent>
        </Card>
    )
}
