import { NextResponse } from "next/server";
import { clearSession, getCurrentUser } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    clearSession();
    return NextResponse.json({ ok: true });
  }

  if (!verifyCsrf(request)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  clearSession();
  return NextResponse.json({ ok: true });
}
