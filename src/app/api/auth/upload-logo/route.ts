import { NextResponse } from "next/server";

import { COACH_BACKEND_URL } from "@/lib/api/config";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const backendFormData = new FormData();
  backendFormData.append("image", file);

  const backendResponse = await fetch(`${COACH_BACKEND_URL}/coach/v1/public/uploadImage`, {
    method: "POST",
    body: backendFormData,
  });

  const data = await backendResponse.json().catch(() => ({}));

  if (!backendResponse.ok) {
    const message = (data && (data.message as string)) || "Could not upload image.";
    return NextResponse.json({ message }, { status: backendResponse.status || 400 });
  }

  return NextResponse.json({ url: data.url as string });
}
