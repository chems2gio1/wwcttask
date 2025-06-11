// app/api/store-token/route.ts
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { accessToken, refreshToken, expiryTime } = await req.json();
    console.log('Received tokens:', {
      accessToken: accessToken?.slice(0, 10) + '...',
      refreshToken: refreshToken?.slice(0, 10) + '...',
      expiryTime,
    });
    // TODO: lưu tokens vào DB/KV
    return NextResponse.json({ message: 'Tokens stored successfully' });
  } catch (error) {
    console.error('Error saving token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
