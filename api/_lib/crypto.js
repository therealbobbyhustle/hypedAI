import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

export function encryptToken(value) {
  if (!value) return null;

  const secret = process.env.SPOTIFY_TOKEN_ENCRYPTION_KEY;
  if (!secret) {
    return `plain:${value}`;
  }

  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptToken(value) {
  if (!value) return null;
  if (value.startsWith("plain:")) return value.replace("plain:", "");

  const secret = process.env.SPOTIFY_TOKEN_ENCRYPTION_KEY;
  if (!secret || !value.startsWith("v1:")) {
    throw new Error("Spotify token decryption is not configured");
  }

  const [, iv, tag, encrypted] = value.split(":");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
