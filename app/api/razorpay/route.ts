import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import * as z from "zod";

const requestBodySchema = z.object({
  amount: z.number().int().positive(),
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY as string,
      key_secret: process.env.RAZORPAY_SECRET as string,
    });
    const body = await req.json();
    const { amount } = requestBodySchema.parse(body);
    console.log("hello");
    console.log("amount:", amount);
    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const response = await razorpay.orders.create(options);
    return NextResponse.json(
      {
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
