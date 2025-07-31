import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { amount, name, description, successUrl, cancelUrl } = await req.json()

    if (!amount || !name || !description || !successUrl || !cancelUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Stripe Checkout Session жасау
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "kzt", // Қазақстан теңгесі
            product_data: {
              name: name,
              description: description,
            },
            unit_amount: amount, // Тиынмен (100 KZT = 10000 тиын)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
