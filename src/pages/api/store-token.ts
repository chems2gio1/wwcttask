// pages/api/store-token.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { accessToken, refreshToken, expiryTime } = req.body;

    console.log('Received tokens:', {
      accessToken: accessToken?.slice(0, 10) + '...',
      refreshToken: refreshToken?.slice(0, 10) + '...',
      expiryTime,
    });

    // TODO: Save tokens to your storage system (e.g., DB, KV, filesystem)

    return res.status(200).json({ message: 'Tokens stored successfully' });
  } catch (error) {
    console.error('Error saving token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
