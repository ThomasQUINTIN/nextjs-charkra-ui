import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { ig_id, caption, image_url } = await request.json();
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('instagram_access_token')

    if (!accessToken) {
        return NextResponse.json({
            message: 'No Instagram access token found'
        })
    }

    try {
        const response = await fetch(`https://graph.instagram.com/v21.0/${ig_id}/media`, {
            method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        body: JSON.stringify({
            caption,
            image_url
        })
        })

        return NextResponse.json(await response.json())
    } catch (error) {
        return NextResponse.json({
            message: `Error publishing container: ${error}`
        })
    }
}