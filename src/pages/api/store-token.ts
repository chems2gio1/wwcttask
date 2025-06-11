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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { accessToken, refreshToken, expiryTime } = req.body

    console.log('Received tokens:', {
      accessToken: accessToken?.slice(0, 10) + '...',
      refreshToken: refreshToken?.slice(0, 10) + '...',
      expiryTime,
    })

    // 🔒 TODO: Lưu vào storage (file, env, DB...)
    // Ví dụ lưu vào ổ đĩa tạm thời (chỉ dev)
    // import fs from 'fs'
    // fs.writeFileSync('tokens.json', JSON.stringify({ accessToken, refreshToken, expiryTime }))

    return res.status(200).json({ message: 'Tokens stored successfully' })
  } catch (error) {
    console.error('Error saving token:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
