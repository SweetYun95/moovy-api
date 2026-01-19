// moovy-api/src/services/mailerService.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: Number(process.env.SMTP_PORT),
   secure: process.env.SMTP_SECURE === 'true', // 587이면 false
   auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
   },
})

export async function sendMail({ to, subject, html }) {
   return transporter.sendMail({
      from: `"Moovy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
   })
}
