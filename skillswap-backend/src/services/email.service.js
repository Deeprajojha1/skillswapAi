import { Resend } from 'resend';
import { env } from '../config/env.js';

let resend;

function getResend() {
  if (!env.resendApiKey) return null;
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

export async function sendEmail({ to = env.adminEmail, subject, html, text }) {
  const client = getResend();
  if (!client) {
    console.log('Email skipped; RESEND_API_KEY is not configured:', { to, subject });
    return { skipped: true };
  }

  return client.emails.send({
    from: env.emailFrom,
    to,
    subject,
    html,
    text,
  });
}
