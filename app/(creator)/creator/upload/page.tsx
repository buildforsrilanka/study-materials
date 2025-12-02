import { getFormOptions } from '@/lib/actions/materials'
import UploadForm from '@/components/creator/UploadForm'

export default async function UploadPage() {
    const { grades, mediums, subjects } = await getFormOptions()

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Upload Materials</h1>
                    <p className="text-muted-foreground">
                        Add new learning resources for students to access.
                    </p>
                </div>

                <UploadForm
                    grades={grades}
                    mediums={mediums}
                    subjects={subjects}
                />
            </div>
        </div>
    )
}
