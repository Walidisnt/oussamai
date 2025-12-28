import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
  })
}
