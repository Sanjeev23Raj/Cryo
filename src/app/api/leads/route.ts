import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email';
import { appendToGoogleSheet } from '@/lib/google-sheet';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, organization, requirement, contactInfo } = body;

    // Validate fields
    if (!name || !contactInfo || !requirement) {
      return NextResponse.json(
        { error: 'Name, Requirement, and Contact Info are required.' },
        { status: 400 }
      );
    }

    const payload = {
      source: 'assistant-widget' as const,
      timestamp: new Date().toISOString(),
      name,
      organization: organization || 'Not Specified',
      phone: contactInfo, // maps to phone or contactInfo
      email: contactInfo, // maps to email or contactInfo
      requirement,
      message: 'Lead captured via floating assistant widget.'
    };

    // Dispatch
    const [emailRes, sheetRes] = await Promise.all([
      sendLeadEmail(payload),
      appendToGoogleSheet(payload)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully.',
      details: { email: emailRes, sheet: sheetRes }
    });

  } catch (error: any) {
    console.error('Leads API Error:', error);
    return NextResponse.json(
      { error: 'An internal error occurred while processing lead.' },
      { status: 500 }
    );
  }
}
