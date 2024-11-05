export function instagramAuthUrl() {
    const clientId = 928033152510197
    const redirectUri = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/instagram`
    const scope = 'business_basic'
    const responseType = 'code'

    return `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`
}
