import { Resend } from 'resend';
import AppError from './appError.js';


async function sendMail(from, to, subject, html) {
    const resend = new Resend(process.env.RESEND_TOKEN);

    const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html
      });
    
      if (error) {
        throw new AppError("server email error", 500)
      }
    
      console.log({ data });
}

export default sendMail;