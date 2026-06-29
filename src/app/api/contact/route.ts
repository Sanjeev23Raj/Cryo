import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email';
import { appendToGoogleSheet } from '@/lib/google-sheet';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyName, phone, email, requirement, message } = body;

    // Validate fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, Phone, and Email are required fields.' },
        { status: 400 }
      );
    }

    const payload = {
      source: 'contact-page' as const,
      timestamp: new Date().toISOString(),
      name,
      organization: companyName || 'Not Specified',
      phone,
      email,
      requirement: requirement || 'Not Specified',
      message: message || ''
    };

    // Parallel execution for high performance
    const [emailRes, sheetRes] = await Promise.all([
      sendLeadEmail(payload),
      appendToGoogleSheet(payload)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your message has been received.',
      details: { email: emailRes, sheet: sheetRes }
    });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
