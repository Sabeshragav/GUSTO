import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface RegistrationEmailData {
  to: string;
  name: string;
  uniqueCode: string;
  events: { title: string; eventType: string; submissionEmail?: string }[];
  amount: number;
}

export async function sendRegistrationEmail(data: RegistrationEmailData) {
  const { to, name, uniqueCode, events, amount } = data;

  const eventRows = events
    .map(
      (e) =>
        `<tr>
                    <td style="padding:8px 12px;border:1px solid #ddd;">${e.title}</td>
                    <td style="padding:8px 12px;border:1px solid #ddd;">${e.eventType}</td>
                </tr>`
    )
    .join('');

  // Build submission reminder section
  const submissionEvents = events.filter((e) => e.eventType === 'ABSTRACT' || e.eventType === 'SUBMISSION');
  let submissionReminder = '';
  if (submissionEvents.length > 0) {
    const items = submissionEvents
      .map(
        (e) =>
          `<li><strong>${e.title}</strong> → Send to: <a href="mailto:${e.submissionEmail}">${e.submissionEmail}</a></li>`
      )
      .join('');
    submissionReminder = `
            <div style="background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-top:16px;">
                <strong>⚠️ Submission Reminder</strong>
                <p>Please send your works for the following events before <strong>March 2, 2026 EOD</strong>:</p>
                <ul>${items}</ul>
            </div>
        `;
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
                    <a href="https://chat.whatsapp.com/PLACEHOLDER_GROUP_LINK" style="display:inline-block;background:#25D366;color:#fff;padding:8px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:13px;">Join WhatsApp Group</a>
                </div>

                <p style="margin-top:20px;color:#6b7280;font-size:13px;">
                    Please keep your unique code safe. You'll need it for check-in on event day.
                </p>
            </div>
        </div>
    `;

  await transporter.sendMail({
    from: `"GUSTO '26" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `Registration Confirmed — ${uniqueCode} | GUSTO '26`,
    html,
  });
}

interface AbstractRejectionData {
  to: string;
  name: string;
  originalEvent: string;
  fallbackEvent: string;
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
            </div>
        </div>
    `;

  await transporter.sendMail({
    from: `"GUSTO '26" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: `Abstract Update — ${originalEvent} | GUSTO '26`,
    html,
  });
}
