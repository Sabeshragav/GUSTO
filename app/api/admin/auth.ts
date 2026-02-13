import { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSKEY || "default-secret-key-change-me";

function signToken(payload: object): string {
    const data = JSON.stringify(payload);
    // Use base64 for data to avoid parsing issues
    const dataB64 = Buffer.from(data).toString("base64");
    const signature = crypto.createHmac("sha256", SECRET).update(dataB64).digest("hex");
    return `${dataB64}.${signature}`;
}

function verifyToken(token: string): any | null {
    if (!token.includes(".")) return null;
    const [dataB64, signature] = token.split(".");
    if (!dataB64 || !signature) return null;

    const expectedSignature = crypto.createHmac("sha256", SECRET).update(dataB64).digest("hex");

    if (signature !== expectedSignature) return null;

    try {
        const data = Buffer.from(dataB64, "base64").toString();
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function generateAdminToken(): string {
    return signToken({ role: "admin", iat: Date.now() });
}

export function validateAdmin(req: NextRequest): boolean {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return false;

    const payload = verifyToken(token);
    return payload && payload.role === "admin";
}
