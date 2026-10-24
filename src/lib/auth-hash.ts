import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

export function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 32);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function checkPassword(pw: string, stored: string) {
  const [s, h] = stored.split(":");
  if (!s || !h) return false;
  const hash = scryptSync(pw, Buffer.from(s, "hex"), 32);
  const want = Buffer.from(h, "hex");
  return want.length === hash.length && timingSafeEqual(hash, want);
}
