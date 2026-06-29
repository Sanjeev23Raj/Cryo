import { NextResponse } from 'next/server';
import { sendSupportEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, purchaseDate, productName, query } = body;

    // Validate fields
    if (!name || !phone || !email || !productName || !query) {
      return NextResponse.json(
        { error: 'Name, Phone, Email, Product Name, and Query are required fields.' },
        { status: 400 }
      );
    }

    const payload = {
      name,
      phone,
      email,
      purchaseDate: purchaseDate || 'Not Specified',
      productName,
      query
    };

    const emailRes = await sendSupportEmail(payload);

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your complaint/query has been received.',
      details: { email: emailRes }
    });

  } catch (error: any) {
    console.error('Support API Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
