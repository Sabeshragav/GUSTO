import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory token store (reset on server restart — acceptable for simple admin)
const adminTokens = new Set<string>();

export function getAdminTokens(): Set<string> {
    return adminTokens;
}

export async function POST(req: NextRequest) {
    try {
        const { passkey } = await req.json();

        if (!passkey || !process.env.ADMIN_PASSKEY) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (passkey !== process.env.ADMIN_PASSKEY) {
            return NextResponse.json(
                { success: false, message: "Invalid passkey" },
                { status: 401 }
            );
        }

        // Generate a simple session token
        const token = crypto.randomBytes(32).toString("hex");

        const response = NextResponse.json({ success: true });
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        adminTokens.add(tokenHash);

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
