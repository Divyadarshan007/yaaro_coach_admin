import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "coach_session";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ message: "idToken is required" }, { status: 400 });
  }

  const backendResponse = await fetch(`${process.env.COACH_BACKEND_URL}/coach/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!backendResponse.ok) {
    return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
  }

  const data = await backendResponse.json();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ coach: data.coach });
}
