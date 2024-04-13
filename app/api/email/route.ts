import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import * as z from "zod";

const requestBodySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  console.log("EMAIL SENDING...");
  const session = await getServerSession(authOptions);
  const email = session?.user.email;
  const body = await request.json();

  const { subject, message } = requestBodySchema.parse(body);

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: email || process.env.MY_EMAIL,
    subject: subject,
    text: `From: ${email}\n\n${message}`,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
