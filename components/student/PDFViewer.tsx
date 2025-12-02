'use client'

interface PDFViewerProps {
    url: string
}

export default function PDFViewer({ url }: PDFViewerProps) {
    // Extract File ID from Google Drive URL to construct preview URL
    let fileId = ''
    const patterns = [
        /\/file\/d\/([^/]+)/,
        /id=([^&]+)/
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match && match[1]) {
            fileId = match[1]
            break
        }
    }

    if (!fileId) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Invalid PDF URL
            </div>
        )
    }

    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`

    return (
        <div className="w-full h-full bg-slate-100">
            <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="autoplay"
                title="PDF Preview"
            />
        </div>
    )
}
