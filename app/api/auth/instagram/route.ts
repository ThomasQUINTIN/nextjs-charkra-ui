import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface ShortLivedTokenResponse {
  access_token: string
  user_id: string
}

interface LongLivedTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=no_code', process.env.NEXT_PUBLIC_NEXTAUTH_URL))
  }

  try {
    // Exchange code for short-lived access token
    const formData = new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID!,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/instagram`,
      code: code
    })

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Instagram API error:', errorData)
      throw new Error(`Failed to exchange code for token: ${errorData}`)
    }

    const shortLivedToken: ShortLivedTokenResponse = await response.json()
    
    // Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?` +
      `grant_type=ig_exchange_token&` +
      `client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&` +
      `access_token=${shortLivedToken.access_token}`
    )

    if (!longLivedTokenResponse.ok) {
      const errorData = await longLivedTokenResponse.text()
      console.error('Instagram API error:', errorData)
      throw new Error(`Failed to exchange for long-lived token: ${errorData}`)
    }

    const longLivedToken: LongLivedTokenResponse = await longLivedTokenResponse.json()
    
    const cookieStore = await cookies()
    const expiresTimestamp = Date.now() + (longLivedToken.expires_in * 1000)

    // Set cookies with appropriate types
    cookieStore.set('instagram_access_token', longLivedToken.access_token, {
      expires: expiresTimestamp,
      secure: true,
    })
    cookieStore.set('instagram_expires_at', expiresTimestamp.toString())

    // Redirect with the long-lived access token
    return NextResponse.redirect(
      new URL(
        `/settings?auth=success&platform=instagram&user_id=${shortLivedToken.user_id}`,
        process.env.NEXTAUTH_URL
      )
    )
  } catch (error) {
    console.error('Error exchanging code for token:', error)
    return NextResponse.redirect(
      new URL('/settings?error=token_exchange_failed', process.env.NEXTAUTH_URL)
    )
  }
}
