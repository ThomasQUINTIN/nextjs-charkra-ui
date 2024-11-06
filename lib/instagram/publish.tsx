import { PublishContainerResponse } from "@/app/api/auth/instagram/containers/route"

export async function instagramPublishContainer(userId: string, caption: string, image_url: string, publish: boolean = false): Promise<PublishContainerResponse> {
    const response = await fetch('/api/auth/instagram/containers', {
        method: 'POST',
        body: JSON.stringify({
            ig_id: userId,
            caption,
            image_url,
            publish: publish ? 'true' : 'false'
        })
    })

    return await response.json()
}