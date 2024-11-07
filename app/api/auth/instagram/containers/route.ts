import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { del } from '@vercel/blob';

export type PublishContainerRequest = {
    ig_id: string
    caption: string
    image_url: string
    publish: string
}

export type PublishContainerResponse = {
    id: string
}

export async function POST(request: Request): Promise<NextResponse<PublishContainerResponse | { message: string }>> {
    const { ig_id, caption, image_url, publish = 'false' }: PublishContainerRequest = await request.json();
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('instagram_access_token')

    if (!accessToken) {
        return NextResponse.json({
            message: 'No Instagram access token found'
        })
    }

    try {
        const responseMedia = await fetch(`https://graph.instagram.com/v21.0/${ig_id}/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                caption,
                image_url
            })
        })
        const media = await responseMedia.json()

        if (publish !== 'true')
            return NextResponse.json(media)

        const responseMedia_publish = await fetch(`https://graph.instagram.com/v21.0/${ig_id}/media_publish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creation_id: media.id
            })
        })

        const media_publish = await responseMedia_publish.json()

        await del(image_url)

        return NextResponse.json(media_publish)
    } catch (error) {
        return NextResponse.json({
            message: `Error publishing container: ${error}`
        })
    }
}