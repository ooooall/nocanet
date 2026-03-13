import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get("room");
  const username = request.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json(
      { error: "Missing room or username" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;
    const url = process.env.LIVEKIT_URL!;

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 36000;

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        iss: apiKey,
        sub: username,
        iat: now,
        exp: exp,
        nbf: now,
        jti: Math.random().toString(36).substring(2),
        video: {
          roomJoin: true,
          room: room,
          canPublish: true,
          canSubscribe: true,
        },
      })
    );

    const signingInput = `${header}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(apiSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signingInput)
    );
    const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const token = `${signingInput}.${sig}`;

    return NextResponse.json({ token, url });
  } catch (err) {
    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
