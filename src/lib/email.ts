import nodemailer from "nodemailer";

interface EventDetail {
    title: string;
    date: string;
    time: string;
    venue: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    return transporter;
}

export async function sendRegistrationEmail(
    to: string,
    name: string,
    regCode: string,
    passTier: string,
    events: EventDetail[]
): Promise<void> {
    const eventRows = events
        .map(
            (e) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: 600;">${e.title}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #eee;">${e.date}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #eee;">${e.time}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #eee;">${e.venue}</td>
        </tr>`
        )
        .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:24px;">
    <div style="background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #F54E00, #FF6B2B); padding:32px 24px; text-align:center;">
        <h1 style="margin:0; color:#fff; font-size:24px; font-weight:700;">GUSTO'26</h1>
        <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">Registration Confirmed ✅</p>
      </div>
      
      <!-- Body -->
      <div style="padding:28px 24px;">
        <p style="margin:0 0 16px; color:#333; font-size:15px;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 20px; color:#555; font-size:14px; line-height:1.6;">
          Thank you for registering for GUSTO'26! Your registration has been received and is being processed.
        </p>

        <!-- Registration Code -->
        <div style="background:#FFF5F0; border:2px solid #F54E00; border-radius:10px; padding:20px; text-align:center; margin:0 0 24px;">
          <p style="margin:0 0 6px; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Your Registration Code</p>
          <p style="margin:0; color:#F54E00; font-size:28px; font-weight:800; letter-spacing:3px;">${regCode}</p>
          <p style="margin:8px 0 0; color:#888; font-size:11px;">Bring this code on the event day for check-in</p>
        </div>

        <!-- Pass Info -->
        <p style="margin:0 0 16px; color:#333; font-size:14px;">
          <strong>Pass:</strong> ${passTier}
        </p>

        <!-- Events Table -->
        <h3 style="margin:0 0 12px; color:#333; font-size:15px;">Your Registered Events</h3>
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#444;">
          <thead>
            <tr style="background:#f8f8f8;">
              <th style="padding:10px 14px; text-align:left; border-bottom:2px solid #eee;">Event</th>
              <th style="padding:10px 14px; text-align:left; border-bottom:2px solid #eee;">Date</th>
              <th style="padding:10px 14px; text-align:left; border-bottom:2px solid #eee;">Time</th>
              <th style="padding:10px 14px; text-align:left; border-bottom:2px solid #eee;">Venue</th>
            </tr>
          </thead>
          <tbody>
            ${eventRows}
          </tbody>
        </table>

        <!-- Footer note -->
        <div style="margin:24px 0 0; padding:16px; background:#f9f9fb; border-radius:8px; border-left:4px solid #F54E00;">
          <p style="margin:0; color:#555; font-size:13px; line-height:1.5;">
            📌 <strong>Important:</strong> Please carry your registration code and a valid college ID card on the event day.
            Report to the registration desk for check-in.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background:#f8f8f8; padding:16px 24px; text-align:center; border-top:1px solid #eee;">
        <p style="margin:0; color:#999; font-size:12px;">
          Government College of Engineering, Erode — Department of Information Technology
        </p>
        <p style="margin:4px 0 0; color:#bbb; font-size:11px;">gustogcee@gmail.com</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const mail = getTransporter();
    await mail.sendMail({
        from: `"GUSTO'26" <${process.env.SMTP_EMAIL}>`,
        to,
        subject: `Registration Confirmed — GUSTO'26 [${regCode}]`,
        html,
    });
}
