export function instagramAuthUrl() {
    const clientId = 928033152510197
    const redirectUri = 'https://3df2-91-205-107-123.ngrok-free.app/api/auth/instagram'
    const scope = 'business_basic'
    const responseType = 'code'

    return `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
}
