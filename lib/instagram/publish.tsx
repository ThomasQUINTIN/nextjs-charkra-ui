export async function instagramPublishContainer(userId: string, caption: string, image_url: string) {
    const response = await fetch('/api/auth/instagram/containers', {
        method: 'POST',
        body: JSON.stringify({
            ig_id: userId,
            caption,
            image_url
        })
    })

    return await response.json()
}