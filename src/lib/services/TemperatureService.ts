import { TemperatureRepository } from '../repositories/TemperatureRepository';
import { TemperatureLog, DateRangeFilter } from '../types';

export class TemperatureService {
  static async getTemperatureData(freezerId: string, page = 1, limit = 50): Promise<{ data: TemperatureLog[]; total: number }> {
    return TemperatureRepository.findByFreezer(freezerId, page, limit);
  }

  static async getTemperatureByDateRange(freezerId: string, filter: DateRangeFilter): Promise<TemperatureLog[]> {
    return TemperatureRepository.findByDateRange(freezerId, filter);
  }

  static async getLatestTemperature(freezerId: string): Promise<TemperatureLog | null> {
    return TemperatureRepository.findLatest(freezerId);
  }

  static async getWeeklyData(freezerId: string): Promise<TemperatureLog[]> {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return TemperatureRepository.findByDateRange(freezerId, {
      from: oneWeekAgo.toISOString(),
      to: now.toISOString(),
    });
  }

  static async getMonthlyData(freezerId: string): Promise<TemperatureLog[]> {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return TemperatureRepository.findByDateRange(freezerId, {
      from: oneMonthAgo.toISOString(),
      to: now.toISOString(),
    });
  }
}
