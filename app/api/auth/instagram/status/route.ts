import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export type InstagramStatusResponse = {
  isConnected: boolean
  user?: {
    id: string
    username: string
    expiredAccount?: Date
  }
  message?: string
}

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('instagram_access_token')
  const expiresAt = cookieStore.get('instagram_expires_at')

  if (!accessToken) {
    return NextResponse.json({
      isConnected: false,
      message: 'No Instagram access token found'
    })
  }

  try {
    // Vérifier si le token est valide en faisant une requête à l'API Instagram
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken.value}`)
    
    if (!response.ok) {
      return NextResponse.json({
        isConnected: false,
        message: 'Invalid Instagram token'
      })
    }

    const data = await response.json()

    return NextResponse.json({
      isConnected: true,
      user: {
        id: data.id,
        username: data.username,
        expiredAccount: expiresAt ? new Date(parseInt(expiresAt.value)) : undefined
      }
    })

  } catch (error) {
    console.error('Error checking Instagram status:', error)
    return NextResponse.json({
      isConnected: false,
      message: 'Error checking Instagram connection status'
    })
  }
} 