import nodemailer from 'nodemailer';

interface OptionProps {
  html: string;
  to: string;
  subject: string;
}

export default async function sendMessage(options: OptionProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
    requireTLS: true,
    port: 465,
  });

  const mailOptions = {
    from: `Ilagan App Team <${process.env.EMAIL_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log('mail sent successfully');
      return { success: true, data: info };
    })
    .catch((err) => {
      return { success: false, data: err };
    });
}
