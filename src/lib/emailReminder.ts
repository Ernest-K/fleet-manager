import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailReminder = async ({ to, subject, template }: { to: string; subject: string; template: React.ReactNode }) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      react: template,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
