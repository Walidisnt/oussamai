import { NextResponse } from "next/server"

export async function GET() {
  const config = {
    // Check if env vars are set (without revealing values)
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,

    // Show lengths to verify they're not empty
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,

    // Show NEXTAUTH_URL (not sensitive)
    nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",

    // Show first and last 4 chars of client ID (for verification)
    googleClientIdPreview: process.env.GOOGLE_CLIENT_ID
      ? `${process.env.GOOGLE_CLIENT_ID.slice(0, 6)}...${process.env.GOOGLE_CLIENT_ID.slice(-4)}`
      : "NOT SET",

    // Environment
    nodeEnv: process.env.NODE_ENV,

    // Expected callback URL
    expectedCallback: `${process.env.NEXTAUTH_URL || 'https://oussamai.vercel.app'}/api/auth/callback/google`,
  }

  return NextResponse.json(config)
}
// Trigger rebuild 1766888425
