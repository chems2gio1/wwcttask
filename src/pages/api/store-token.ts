// pages/api/store-token.ts

export const runtime = 'edge'

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { accessToken, refreshToken, expiryTime } = await req.json()

    console.log('Received tokens:', {
      accessToken: accessToken?.slice(0, 10) + '...',
      refreshToken: refreshToken?.slice(0, 10) + '...',
      expiryTime,
    })

    // TODO: Add token storage logic here (KV, DB, etc.)

    return new Response(JSON.stringify({ message: 'Tokens stored successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error storing token:', error)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
