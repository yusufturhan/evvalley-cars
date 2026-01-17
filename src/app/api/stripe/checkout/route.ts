import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { listingId } = body;

    // Validate listingId
    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid listingId' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.STRIPE_PRICE_PRIVATE_CAR) {
      console.error('Missing STRIPE_PRICE_PRIVATE_CAR environment variable');
      return NextResponse.json(
        { error: 'Payment system configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Missing NEXT_PUBLIC_APP_URL environment variable');
      return NextResponse.json(
        { error: 'Application configuration error' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRIVATE_CAR,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sell/success?listingId=${listingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/sell/cancel?listingId=${listingId}`,
      metadata: {
        listingId,
        category: 'car',
      },
      // Optional: Pre-fill customer email if available
      customer_email: body.customerEmail || undefined,
    });

    // Return the checkout URL
    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    );

  } catch (error) {
    console.error('Stripe Checkout error:', error);
    
    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
