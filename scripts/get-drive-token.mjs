/**
 * One-time script to get a Google OAuth2 refresh token for Drive uploads.
 *
 * Prerequisites:
 *   1. Go to Google Cloud Console → APIs & Services → Credentials
 *   2. Create an OAuth 2.0 Client ID (type: Web application)
 *   3. Add http://localhost:3333 as an Authorized redirect URI
 *   4. Copy the Client ID and Client Secret
 *
 * Usage:
 *   node scripts/get-drive-token.mjs <CLIENT_ID> <CLIENT_SECRET>
 *
 * It will open a URL, you authorize, and it prints the refresh token.
 */

import { createServer } from "http";

const clientId = process.argv[2];
const clientSecret = process.argv[3];

if (!clientId || !clientSecret) {
  console.error(
    "Usage: node scripts/get-drive-token.mjs <CLIENT_ID> <CLIENT_SECRET>",
  );
  process.exit(1);
}

const REDIRECT_URI = "http://localhost:3333";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const authUrl =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(clientId)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log("\n🔗 Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n⏳ Waiting for authorization...\n");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Error: No authorization code received</h1>");
    return;
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.refresh_token) {
      console.log("✅ Success! Add these to your .env.local:\n");
      console.log(`GOOGLE_OAUTH_CLIENT_ID="${clientId}"`);
      console.log(`GOOGLE_OAUTH_CLIENT_SECRET="${clientSecret}"`);
      console.log(`GOOGLE_OAUTH_REFRESH_TOKEN="${tokens.refresh_token}"`);
      console.log("");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        "<h1>✅ Success!</h1><p>Refresh token printed in terminal. You can close this tab.</p>",
      );
    } else {
      console.error("❌ No refresh token received:", tokens);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>Error</h1><pre>${JSON.stringify(tokens, null, 2)}</pre>`);
    }
  } catch (err) {
    console.error("❌ Token exchange failed:", err);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>Token exchange failed</h1>");
  }

  server.close();
  process.exit(0);
});

server.listen(3333, () => {
  console.log("Listening on http://localhost:3333 for OAuth callback...");
});
