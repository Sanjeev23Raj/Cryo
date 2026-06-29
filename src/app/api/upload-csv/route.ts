import { NextRequest, NextResponse } from 'next/server';
import { TemperatureRepository } from '@/lib/repositories/TemperatureRepository';

export async function POST(req: NextRequest) {
  try {
    const { csvText, freezerId } = await req.json();

    if (!csvText) {
      return NextResponse.json({ error: 'No CSV data provided' }, { status: 400 });
    }

    const rows = csvText.split('\n');
    const logsToInsert: { freezer_id: string; temperature: number; timestamp: string }[] = [];
    
    let timestampIdx = -1;
    let tempIdx = -1;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;

      const cols = row.split(',');
      if (cols.length < 2) continue;

      if (timestampIdx === -1) {
        const headers = cols.map((c: string) => c.trim().toLowerCase());
        timestampIdx = headers.findIndex((h: string) => h.includes('time') || h.includes('date') || h.includes('ts') || h.includes('timestamp'));
        tempIdx = headers.findIndex((h: string) => h.includes('temp') || h.includes('val') || h.includes('deg'));
        
        // Default fallbacks if header matches fail
        if (timestampIdx === -1 || tempIdx === -1) {
          timestampIdx = 0;
          tempIdx = 1;
        }
        continue;
      }

      const timestampVal = new Date(cols[timestampIdx]?.trim());
      const tempVal = parseFloat(cols[tempIdx]?.trim());

      if (!isNaN(timestampVal.getTime()) && !isNaN(tempVal)) {
        logsToInsert.push({
          freezer_id: freezerId || 'FRZ-001',
          temperature: tempVal,
          timestamp: timestampVal.toISOString(),
        });
      }
    }

    if (logsToInsert.length === 0) {
      return NextResponse.json({ error: 'No valid data points found in CSV' }, { status: 400 });
    }

    const inserted = await TemperatureRepository.createBulk(logsToInsert);

    return NextResponse.json({
      success: true,
      insertedCount: inserted.length,
    });
  } catch (error: any) {
    console.error('CSV Import API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
