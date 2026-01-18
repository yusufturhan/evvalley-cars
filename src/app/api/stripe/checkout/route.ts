import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force Node.js runtime for Stripe
export const runtime = 'nodejs';

// Helper function to get Stripe instance (lazy initialization)
function getStripeInstance(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  
  return new Stripe(apiKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Missing STRIPE_SECRET_KEY environment variable');
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    if (!process.env.STRIPE_PRICE_PRIVATE_CAR) {
      console.error('❌ Missing STRIPE_PRICE_PRIVATE_CAR environment variable');
      return NextResponse.json(
        { error: 'Payment pricing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('❌ Missing NEXT_PUBLIC_APP_URL environment variable');
      return NextResponse.json(
        { error: 'Application URL is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { listingId, customerEmail } = body;

    // Validate listingId
    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid listingId' },
        { status: 400 }
      );
    }

    // Initialize Stripe AFTER env validation (lazy initialization)
    const stripe = getStripeInstance();

    // Create Stripe Checkout Session for subscription
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
      // Optional: Pre-fill customer email if provided
      customer_email: customerEmail || undefined,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Set billing address collection
      billing_address_collection: 'auto',
    });

    console.log('✅ Stripe Checkout Session created:', session.id);

    // Return the checkout URL
    return NextResponse.json(
      { url: session.url },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Stripe Checkout error:', error);
    
    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }

    // Handle generic errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Fallback error
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
