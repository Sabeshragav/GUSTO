import { NextRequest } from "next/server";
import crypto from "crypto";
import { getAdminTokens } from "./login/route";

export function validateAdmin(req: NextRequest): boolean {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return false;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    return getAdminTokens().has(tokenHash);
}
