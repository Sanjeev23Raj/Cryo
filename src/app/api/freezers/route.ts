import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/database';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ freezers: db.freezers });
  } catch (error: any) {
    console.error('Fetch freezers list error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, customerName, model } = await req.json();

    if (!id || !customerName || !model) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const db = readDb();
    
    // Check if duplicate ID exists
    const duplicate = db.freezers.some((f) => f.id === id);
    if (duplicate) {
      return NextResponse.json({ error: 'Freezer ID already exists' }, { status: 400 });
    }

    const newFreezer = {
      id,
      customerName,
      model,
      status: 'Normal' as const,
    };

    db.freezers.push(newFreezer);

    // Initialize telemetry logs with baseline seed values for the new freezer
    const now = new Date();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const numIntervals = 7 * 24 * 6; // 10-minute intervals
    let idCounter = db.temperature_logs.length + 1;

    for (let i = 0; i <= numIntervals; i++) {
      const timestamp = new Date(startTime.getTime() + i * 10 * 60 * 1000);
      const timeStr = timestamp.toISOString();
      const base = id.toLowerCase().includes('cryo') || model.toLowerCase().includes('cryo') ? -18.0 : 4.0;
      const deviationRange = id.toLowerCase().includes('cryo') || model.toLowerCase().includes('cryo') ? 5.0 : 6.0;

      let temp = base + Math.sin((i / (24 * 6)) * Math.PI * 2) * (deviationRange * 0.12);
      temp += Math.sin(i * 1.5) * 0.85; 
      temp += (Math.random() - 0.5) * 0.15;

      db.temperature_logs.push({
        id: `LOG-${String(idCounter++).padStart(6, '0')}`,
        freezer_id: id,
        temperature: parseFloat(temp.toFixed(2)),
        timestamp: timeStr,
        created_at: timeStr,
      });
    }

    writeDb(db);
    return NextResponse.json({ success: true, freezer: newFreezer });
  } catch (error: any) {
    console.error('Register freezer API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
