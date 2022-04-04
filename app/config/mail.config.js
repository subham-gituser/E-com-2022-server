import nodemailer from 'nodemailer'
import { OAuth2Client } from "google-auth-library";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;


const sendMail = async (recipient, message) => {
  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: "ashoksahu1105@gmail.com",
      pass: "ashok$1111",
    },
    tls: {
      rejectUnauthorized: false,
    },
    requireTLS: true,
  });

  const data = {
    from: `KSoft Solution <${process.env.SENDER_EMAIL_ADDRESS}>`,
    to: recipient,
    subject: `${message.subject}`,
    text: `${message.text}`,
    html: `${message.html}`,
  };

  await transporter
    .sendMail(data)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

export default sendMail