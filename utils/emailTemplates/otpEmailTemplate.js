// utils/emailTemplates/otpEmailTemplate.js
function otpEmailTemplate({
  otp,
  appName = "KI CHAI",
  logoUrl = "",
  supportEmail = "",
  validity = 10,
  verifyUrl = ""
}) {
  const year = new Date().getFullYear();
  const spacedOtp = String(otp).split("").join(" ");
  const preheader = `Your ${appName} OTP is ${otp}. It expires in ${validity} minutes.`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${appName} Login OTP</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <!-- Preheader (inbox preview text) -->
    <div style="display:none;visibility:hidden;opacity:0;height:0;overflow:hidden;mso-hide:all;">
      ${preheader}
    </div>

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
                <h1 style="margin:0;font-size:20px;line-height:28px;color:#111827;">Your login code</h1>
                <p style="margin:8px 0 0;font-size:14px;line-height:20px;color:#374151;">
                  Use the code below to complete your sign in. This code will expire in ${validity} minutes.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;">
                <div style="background:#111827;color:#ffffff;border-radius:8px;padding:16px;text-align:center;letter-spacing:4px;font-size:28px;font-weight:700;">
                  ${spacedOtp}
                </div>
              </td>
            </tr>

            ${verifyUrl ? `
            <tr>
              <td style="padding:0 24px 8px;text-align:center;">
                <a href="${verifyUrl}" style="display:inline-block;background:#0b5a46;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">
                  Verify OTP
                </a>
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:0 24px 16px;">
                <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                  If you didn’t request this code, you can safely ignore this email.
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

module.exports = otpEmailTemplate;