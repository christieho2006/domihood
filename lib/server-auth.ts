import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "domi_session";
const SESSION_SECONDS = 60 * 60 * 24 * 14;

export type DomiSession = { id: string; nickname: string; exp: number };

let adminClient: SupabaseClient | null = null;

export function getAdminDb() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("AUTH_STORAGE_NOT_CONFIGURED");
  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
  }
  return adminClient;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_NOT_CONFIGURED");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function assertAuthConfigured() {\n  getSessionSecret();\n  getAdminDb();\n}\n\nexport function normalizeNickname(value: string) {
  return value.normalize("NFKC").trim().toLowerCase();
}

export function isValidNickname(value: string) {
  return /^[\p{L}\p{N}_-]{2,16}$/u.test(value);
}

export async function createSession(id: string, nickname: string) {
  const payload = Buffer.from(JSON.stringify({
    id, nickname, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  })).toString("base64url");
  const token = payload + "." + sign(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function readSession(): Promise<DomiSession | null> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return null;
    const expected = sign(payload);
    const actualBytes = Buffer.from(signature);
    const expectedBytes = Buffer.from(expected);
    if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) return null;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DomiSession;
    if (!value.id || !value.nickname || !Number.isFinite(value.exp) || value.exp <= Date.now() / 1000) return null;
    return value;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isAuthConfigurationError(error: unknown) {
  return error instanceof Error && (
    error.message === "AUTH_STORAGE_NOT_CONFIGURED" ||
    error.message === "SESSION_SECRET_NOT_CONFIGURED"
  );
}
