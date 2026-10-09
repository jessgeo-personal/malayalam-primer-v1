const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends an OTP access code email to a user.
 *
 * @param {string} email - Destination email address
 * @param {string} otpCode - 6-digit one-time password
 * @returns {Promise<{ success: boolean, simulated?: boolean, id?: string, error?: any }>}
 */
async function sendOTP(email, otpCode) {
  try {
    // Test / CI environment guard or missing key simulation
    if (process.env.NODE_ENV === 'test' || !process.env.RESEND_API_KEY) {
      return { success: true, simulated: true, id: 'mock-msg-id' };
    }

    const client = resend || new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || 'Malayalam Prime <onboarding@resend.dev>';
    const subject = 'Your Malayalam Prime Access Code';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Malayalam Prime Access Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFDF6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1E26;">
  <div style="max-width: 480px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; padding: 32px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #1A1E26; letter-spacing: -0.5px;">Malayalam Prime</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748B;">Parent & Learner Verification</p>
    </div>
    
    <div style="text-align: center; padding: 24px 16px; background-color: #F8FAFC; border-radius: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748B; font-weight: 500;">Use the code below to access your account:</p>
      <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #059669; font-family: monospace; padding: 8px 0;">
        ${otpCode}
      </div>
      <p style="margin: 12px 0 0 0; font-size: 13px; color: #94A3B8;">This code will expire in 10 minutes.</p>
    </div>

    <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0 0 16px 0; text-align: center;">
      If you did not request this verification code, you can safely ignore this email.
    </p>

    <div style="border-top: 1px solid #F1F5F9; padding-top: 16px; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #94A3B8;">&copy; ${new Date().getFullYear()} Malayalam Prime. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const response = await client.emails.send({
      from,
      to: email,
      subject,
      html
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    return { success: true, id: response.data?.id || 'mock-msg-id', ...response.data };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = {
  sendOTP
};
