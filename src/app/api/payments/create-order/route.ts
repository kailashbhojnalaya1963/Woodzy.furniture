import { NextResponse } from "next/server";
import { SITE } from "@/config/site";

/**
 * Razorpay order creation — architected but inert until payments go live.
 * Returns 503 while `paymentsEnabled` is false or keys are missing. To enable:
 *   1) set SITE.paymentsEnabled = true
 *   2) add RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
 *   3) `npm i razorpay` and uncomment the order-creation block below.
 */
export async function POST(req: Request) {
  const keysPresent = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  if (!SITE.paymentsEnabled || !keysPresent) {
    return NextResponse.json({ error: "payments_disabled" }, { status: 503 });
  }

  const { amount } = (await req.json()) as { amount: number };

  // import Razorpay from "razorpay";
  // const rzp = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID!,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
  // });
  // const order = await rzp.orders.create({ amount: Math.round(amount * 100), currency: "INR" });
  // return NextResponse.json(order);

  return NextResponse.json({ error: "not_implemented", amount }, { status: 501 });
}
