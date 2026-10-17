import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "../../../lib/admin-session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}