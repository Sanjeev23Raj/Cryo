import { NextRequest, NextResponse } from 'next/server';
import { TemperatureRepository } from '@/lib/repositories/TemperatureRepository';
import { TemperatureService } from '@/lib/services/TemperatureService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const freezerId = searchParams.get('freezerId') || 'FRZ-001';
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // If dates are specified, fetch range
    if (from || to) {
      const data = await TemperatureService.getTemperatureByDateRange(freezerId, { from, to });
      return NextResponse.json({ data, total: data.length });
    }

    // Otherwise, fetch paginated logs
    const result = await TemperatureService.getTemperatureData(freezerId, page, limit);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Freezer data API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { freezerId, temperature, timestamp } = body;

    if (!freezerId || temperature === undefined) {
      return NextResponse.json({ error: 'Missing required parameters: freezerId, temperature' }, { status: 400 });
    }

    const inserted = await TemperatureRepository.create({
      freezer_id: freezerId,
      temperature: parseFloat(temperature),
      timestamp: timestamp || new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: inserted,
    });
  } catch (error: any) {
    console.error('Real-time ingestion API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
