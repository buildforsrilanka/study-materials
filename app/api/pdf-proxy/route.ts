import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const url = searchParams.get('url')

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 })
    }

    try {
        // Extract File ID from Google Drive URL
        // Supports formats:
        // https://drive.google.com/file/d/FILE_ID/view
        // https://drive.google.com/open?id=FILE_ID
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
            return new NextResponse('Invalid Google Drive URL', { status: 400 })
        }

        // Fetch from Google Drive using the export=download endpoint
        const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
        const response = await fetch(driveUrl)

        if (!response.ok) {
            return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status })
        }

        // Forward the content type and length if available
        const headers = new Headers()
        headers.set('Content-Type', 'application/pdf')
        if (response.headers.get('Content-Length')) {
            headers.set('Content-Length', response.headers.get('Content-Length')!)
        }

        // Return the stream
        return new NextResponse(response.body, {
            status: 200,
            headers,
        })

    } catch (error) {
        console.error('PDF Proxy Error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
