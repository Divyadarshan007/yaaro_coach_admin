import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { COACH_BACKEND_URL } from "@/lib/api/config";

const SESSION_COOKIE = "coach_session";

export async function POST(request: Request) {
  const body = await request.json();

  const backendResponse = await fetch(`${COACH_BACKEND_URL}/coach/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    const message =
      (data && (data.message as string)) ||
      "Could not create your account. Please check your details and try again.";
    const errors = data && data.errors ? data.errors : undefined;
    return NextResponse.json({ message, errors }, { status: backendResponse.status || 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ coach: data.coach, studio: data.studio });
}
