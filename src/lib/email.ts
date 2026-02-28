import {
  AbstractRejectionData,
  RegistrationEmailData,
} from "@/types/email.types";
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// const ses = new SESClient({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!,
//   },
// });

/**
 * Send an email via Brevo (Sendinblue) REST API.
 * Used as fallback when SES is in sandbox mode.
 */
async function sendViaBrevo(
  to: string,
  subject: string,
  html: string,
  maxRetries = 3,
): Promise<void> {
  console.log(`[Email/Brevo] Sending to ${to} | Subject: "${subject}"`);

  const payload = JSON.stringify({
    sender: { name: "GUSTO '26", email: "noreply@gustogcee.in" },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: payload,
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(
          `[Email/Brevo] FAILED for ${to} | Status: ${res.status} | Body: ${body}`,
        );
        throw new Error(`Brevo API error ${res.status}: ${body}`);
      }

      console.log(`[Email/Brevo] SUCCESS for ${to}`);
      return;
    } catch (err: any) {
      if (attempt < maxRetries) {
        const delay = 500 * attempt;
        console.warn(
          `[Email/Brevo] Attempt ${attempt}/${maxRetries} failed for ${to}: ${err.message}. Retrying in ${delay}ms...`,
        );
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

/**
 * Try SES first, fall back to Brevo on failure.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`[Email] Dispatching email to ${to}`);
  return sendViaBrevo(to, subject, html);
}

export async function sendRegistrationEmail(data: RegistrationEmailData) {
  const { to, name, uniqueCode, events, amount } = data;

  const eventRows = events
    .map(
      (e) =>
        `<tr>
                    <td style="padding:8px 12px;border:1px solid #ddd;">${e.title}</td>
                    <td style="padding:8px 12px;border:1px solid #ddd;">${e.eventType}</td>
                </tr>`,
    )
    .join("");

  // Build submission reminder section — different deadlines per type
  const abstractEvents = events.filter((e) => e.eventType === "ABSTRACT");
  const submissionOnlyEvents = events.filter(
    (e) => e.eventType === "SUBMISSION",
  );
  let submissionReminder = "";

  if (abstractEvents.length > 0 || submissionOnlyEvents.length > 0) {
    if (abstractEvents.length > 0) {
      const items = abstractEvents
        .map(
          (e) =>
            `<li><strong>${e.title}</strong> → Send to: <a href="mailto:${e.submissionEmail}">${e.submissionEmail}</a></li>`,
        )
        .join("");
      submissionReminder += `
            <div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-top:16px;">
                <strong>⚠️ Paper/Project Submission Reminder</strong>
                <p>Submit before <strong>March 3rd, 2026 EOD</strong>:</p>
                <ul>${items}</ul>
            </div>`;
    }

    if (submissionOnlyEvents.length > 0) {
      const items = submissionOnlyEvents
        .map(
          (e) =>
            `<li><strong>${e.title}</strong> → Send to: <a href="mailto:${e.submissionEmail}">${e.submissionEmail}</a></li>`,
        )
        .join("");
      submissionReminder += `
            <div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-top:16px;">
                <strong>⚠️ Online Events Submission Reminder</strong>
                <p>Submit before <strong>March 5th, 2026 3:00 PM</strong>:</p>
                <ul>${items}</ul>
            </div>`;
    }
  }

  const html = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px;border-radius:12px 12px 0 0;">
                <h1 style="color:#fff;margin:0;">Registration Confirmed! 🎉</h1>
                <p style="color:#e0e7ff;margin:4px 0 0;">GUSTO '26 — Government College of Engineering, Erode</p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Your registration for <strong>GUSTO '26</strong> has been confirmed!</p>

                <div style="background:#f0fdf4;border:1px solid #22c55e;padding:12px;border-radius:8px;margin:16px 0;">
                    <p style="margin:0;font-size:14px;">Your Unique Code</p>
                    <p style="margin:4px 0 0;font-size:24px;font-weight:bold;color:#16a34a;letter-spacing:2px;">${uniqueCode}</p>
                </div>

                <h3>Your Events</h3>
                <table style="width:100%;border-collapse:collapse;margin:8px 0;">
                    <thead>
                        <tr style="background:#f8fafc;">
                            <th style="padding:8px 12px;border:1px solid #ddd;text-align:left;">Event</th>
                            <th style="padding:8px 12px;border:1px solid #ddd;text-align:left;">Type</th>
                        </tr>
                    </thead>
                    <tbody>${eventRows}</tbody>
                </table>

                <p><strong>Amount Paid:</strong> ₹${amount}</p>

                ${submissionReminder}

                <div style="background:#dcfce7;border:1px solid #22c55e;padding:12px;border-radius:8px;margin-top:16px;text-align:center;">
                    <p style="margin:0;font-size:14px;font-weight:bold;">💬 Join the GUSTO '26 WhatsApp Group</p>
                    <p style="margin:4px 0 8px;font-size:12px;color:#6b7280;">Stay updated and connect with other participants</p>
                    <a href="https://chat.whatsapp.com/GrLcESGCd110KDrP9QCoH0" style="display:inline-block;background:#25D366;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Join WhatsApp Group</a>
                </div>

                <p style="margin-top:20px;color:#6b7280;font-size:13px;">
                    Please keep your unique code safe. You'll need it for check-in on event day.
                </p>
            </div>
        </div>
    `;

  const subject = `Registration Confirmed — ${uniqueCode} | GUSTO '26`;
  await sendEmail(to, subject, html);
}

export async function sendAbstractRejectionEmail(data: AbstractRejectionData) {
  const { to, name, originalEvent, fallbackEvent } = data;

  const html = `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:24px;border-radius:12px 12px 0 0;">
                <h1 style="color:#fff;margin:0;">Abstract Review Update</h1>
                <p style="color:#fee2e2;margin:4px 0 0;">GUSTO '26 — Government College of Engineering, Erode</p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Unfortunately, your abstract for <strong>${originalEvent}</strong> was not shortlisted.</p>

                <div style="background:#fef3c7;border:1px solid #f59e0b;padding:12px;border-radius:8px;margin:16px 0;">
                    <p style="margin:0;"><strong>Good news!</strong> You've been automatically registered for your fallback event:</p>
                    <p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#d97706;">${fallbackEvent}</p>
                </div>

                <p style="color:#6b7280;font-size:13px;">
                    No action is needed on your part. Your registration remains valid.
                </p>
                
                <div style="background:#dcfce7;border:1px solid #22c55e;padding:12px;border-radius:8px;margin-top:16px;text-align:center;">
                    <p style="margin:0;font-size:14px;font-weight:bold;">💬 Join the GUSTO '26 WhatsApp Group</p>
                    <p style="margin:4px 0 8px;font-size:12px;color:#6b7280;">In case you haven't joined our WhatsApp group yet, join it here</p>
                    <a href="https://chat.whatsapp.com/GrLcESGCd110KDrP9QCoH0" style="display:inline-block;background:#25D366;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Join WhatsApp Group</a>
                </div>
            </div>
        </div>
    `;

  const subject = `Abstract Update — ${originalEvent} | GUSTO '26`;
  await sendEmail(to, subject, html);
}
