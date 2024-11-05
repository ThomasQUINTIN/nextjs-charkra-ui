import { InstagramStatusResponse } from "@/app/api/auth/instagram/status/route"
import { useQuery } from "react-query"

export const useInstagramStatus = () => {
    return useQuery<InstagramStatusResponse>('instagramStatus', async () => {
      const response = await fetch('/api/auth/instagram/status')
      return await response.json()
    }, {
      onSuccess(data) {
        console.log('Instagram status:', data)
      },
      initialData: {
        isConnected: false,
        message: 'Loading...'
      }
    })
  }