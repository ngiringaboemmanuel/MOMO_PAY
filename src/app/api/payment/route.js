import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, amount, message } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { error: 'Phone and amount are required' },
        { status: 400 }
      );
    }

    const formattedPhone = phone.startsWith('250') ? phone : `250${phone.replace(/^0/, '')}`;

    const tokenResponse = await fetch(process.env.MOMO_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': process.env.MOMO_BASIC_AUTH,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
      },
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text();
      console.error('Token error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 401 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const referenceId = crypto.randomUUID();

    const paymentResponse = await fetch(process.env.MOMO_REQUEST_TO_PAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MOMO_SUBSCRIPTION_KEY,
        'X-Target-Environment': process.env.MOMO_TARGET_ENV,
        'X-Reference-Id': referenceId,
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'RWF',
        externalId: referenceId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: formattedPhone,
        },
        payerMessage: message || 'Payment request',
        payeeNote: message || 'Payment request',
      }),
    });

    if (!paymentResponse.ok) {
      const paymentError = await paymentResponse.text();
      console.error('Payment error:', paymentError);
      return NextResponse.json(
        { error: 'Payment request failed' },
        { status: paymentResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Payment request initiated successfully',
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'API is running' });
}