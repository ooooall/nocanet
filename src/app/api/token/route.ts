import { NextRequest, NextResponse } from "next/server";

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

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

    const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64url(
      JSON.stringify({
        iss: apiKey,
        sub: username,
        iat: now,
        exp: now + 36000,
        nbf: now,
        jti: crypto.randomUUID(),
        video: {
          roomJoin: true,
          room: room,
          canPublish: true,
          canSubscribe: true,
          canPublishData: true,
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

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signingInput)
    );

    const sig = Buffer.from(signatureBytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const token = `${signingInput}.${sig}`;

    return NextResponse.json({ token, url });
  } catch (err) {
    console.error("Token error:", err);
    return NextResponse.json(
      { error: "Token generation failed" },
      { status: 500 }
    );
  }
}
