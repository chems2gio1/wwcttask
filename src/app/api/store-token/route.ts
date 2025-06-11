export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { accessToken, refreshToken, expiryTime } = await req.json()

    console.log('Received tokens:', {
      accessToken: accessToken?.slice(0, 10) + '...',
      refreshToken: refreshToken?.slice(0, 10) + '...',
      expiryTime,
    })

    return new Response(JSON.stringify({ message: 'Tokens stored successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error storing token:', err)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}