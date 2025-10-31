function loginAlertTemplate({
  appName = "KI CHAI",
  email, ip, city, region, country, userAgent, timeStr, note, logoUrl, supportEmail
}) {
  const locationStr = [city, region, country].filter(Boolean).join(", ");
  const year = new Date().getFullYear();

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${appName} - New login</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fc;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:10px;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px 24px 0;text-align:center;">
                ${logoUrl ? `<img src="${logoUrl}" alt="${appName} logo" width="56" height="56" style="display:block;margin:0 auto 8px;border-radius:8px;">` : ""}
                <div style="font-size:18px;font-weight:700;color:#111827;">${appName}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 0;">
                <h1 style="margin:0;font-size:20px;line-height:28px;color:#111827;">New login to your account</h1>
                <p style="margin:8px 0 0;font-size:14px;line-height:20px;color:#374151;">
                  We noticed a new sign-in to your ${appName} account (${email}). If this was you, no action is needed.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="border-collapse:separate;">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                      <strong>IP Address:</strong> ${ip || "Unknown"}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                      <strong>Location:</strong> ${locationStr || "Unknown"}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
                      <strong>Time:</strong> ${timeStr} ${note ? "(" + note + ")" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;">
                      <strong>Device:</strong> ${userAgent || "Unknown"}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px;">
                <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                  If this wasn’t you, we recommend changing your password immediately and contacting support.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
                ${supportEmail ? `<p style="margin:0;font-size:12px;color:#6b7280;">Need help? <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:none;">${supportEmail}</a></p>` : ""}
                <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">© ${year} ${appName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

module.exports = loginAlertTemplate;