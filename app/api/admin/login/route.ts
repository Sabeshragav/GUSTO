import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "../auth";

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

        // Generate stateless session token (signed JWT-like)
        const token = generateAdminToken();

        const response = NextResponse.json({ success: true });
        
        // Allow running production build locally (npm start) without https
        const isLocal = req.nextUrl.hostname === "localhost" || req.nextUrl.hostname === "127.0.0.1";

        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" && !isLocal,
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
