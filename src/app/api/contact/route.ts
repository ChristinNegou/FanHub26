import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.enum(['partnership', 'bar_inquiry', 'bug_report', 'other']),
  message: z.string().min(10).max(2000),
});

const SUBJECT_LABELS: Record<string, string> = {
  bar_inquiry: 'Inscrire / gérer mon bar',
  partnership: 'Partenariat / publicité',
  bug_report: 'Signaler un problème',
  other: 'Autre',
};

const ADMIN_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL ?? 'jordydeangelis@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return NextResponse.json({ error: first ?? 'Validation error' }, { status: 422 });
  }

  const { name, email, subject, message } = parsed.data;

  // Save to DB
  const supabase = createAdminClient();
  const { error: dbError } = await supabase.from('contact_submissions').insert(parsed.data);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  // Send notification email (non-blocking — don't fail the request if email fails)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `FanHub26 Contact <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `[FanHub26] Nouveau message : ${SUBJECT_LABELS[subject] ?? subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
            <h2 style="color: #1e293b; margin-top: 0;">📬 Nouveau message FanHub26</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
              <tr style="background: #1d4ed8; color: white;">
                <td style="padding: 12px 16px; font-weight: 600;">Champ</td>
                <td style="padding: 12px 16px; font-weight: 600;">Valeur</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; color: #64748b; font-weight: 500;">Nom</td>
                <td style="padding: 12px 16px; color: #1e293b;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                <td style="padding: 12px 16px; color: #64748b; font-weight: 500;">Email</td>
                <td style="padding: 12px 16px;"><a href="mailto:${email}" style="color: #1d4ed8;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 16px; color: #64748b; font-weight: 500;">Sujet</td>
                <td style="padding: 12px 16px; color: #1e293b;">${SUBJECT_LABELS[subject] ?? subject}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; color: #64748b; font-weight: 500; vertical-align: top;">Message</td>
                <td style="padding: 12px 16px; color: #1e293b; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
              </tr>
            </table>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px; text-align: center;">
              Répondre directement à cet email pour contacter ${name}.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Resend error:', emailErr);
    }
  }

  return NextResponse.json({ success: true });
}
