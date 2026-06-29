import { readDb, writeDb } from '../database';
import { TemperatureLog, DateRangeFilter } from '../types';

export class TemperatureRepository {
  static async create(log: Omit<TemperatureLog, 'id' | 'created_at'>): Promise<TemperatureLog> {
    const db = readDb();
    const newId = `LOG-${String(db.temperature_logs.length + 1).padStart(6, '0')}`;
    const timestampStr = new Date().toISOString();

    const newLog: TemperatureLog = {
      ...log,
      id: newId,
      created_at: timestampStr,
    };

    db.temperature_logs.push(newLog);
    writeDb(db);
    return newLog;
  }

  static async createBulk(newLogs: Omit<TemperatureLog, 'id' | 'created_at'>[]): Promise<TemperatureLog[]> {
    const db = readDb();
    const timestampStr = new Date().toISOString();
    let counter = db.temperature_logs.length + 1;

    const insertedLogs: TemperatureLog[] = newLogs.map((log) => ({
      ...log,
      id: `LOG-${String(counter++).padStart(6, '0')}`,
      created_at: timestampStr,
    }));

    db.temperature_logs.push(...insertedLogs);
    writeDb(db);
    return insertedLogs;
  }

  static async findLatest(freezerId: string): Promise<TemperatureLog | null> {
    const db = readDb();
    const matches = db.temperature_logs.filter((log) => log.freezer_id === freezerId);
    if (matches.length === 0) return null;

    matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return matches[0];
  }

  static async findByDateRange(freezerId: string, filter: DateRangeFilter): Promise<TemperatureLog[]> {
    const db = readDb();
    let matches = db.temperature_logs.filter((log) => log.freezer_id === freezerId);

    if (filter.from) {
      const fromTime = new Date(filter.from).getTime();
      matches = matches.filter((log) => new Date(log.timestamp).getTime() >= fromTime);
    }
    if (filter.to) {
      const toTime = new Date(filter.to).getTime();
      matches = matches.filter((log) => new Date(log.timestamp).getTime() <= toTime);
    }

    matches.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return matches;
  }

  static async findByFreezer(freezerId: string, page = 1, limit = 50): Promise<{ data: TemperatureLog[]; total: number }> {
    const db = readDb();
    const matches = db.temperature_logs.filter((log) => log.freezer_id === freezerId);

    matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = matches.length;
    const offset = (page - 1) * limit;
    const paginated = matches.slice(offset, offset + limit);

    return {
      data: paginated,
      total,
    };
  }
}
