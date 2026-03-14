import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const ADMIN_USER = "admin";
const ADMIN_PASS = "od1_26";
const SECRET     = new TextEncoder().encode(
  process.env.ADMIN_SECRET ?? "fallback-dev-secret-change-in-prod"
);

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  // Crear un JWT firmado con expiración de 8 horas
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });

  return NextResponse.json({ ok: true });
}