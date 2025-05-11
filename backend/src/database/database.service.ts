import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import * as storage from 'node-persist';
import { CarbonEstimationResult } from '../carbon/types';
import * as fs from 'fs';
export interface EstimationRecord {
  id: string;
  timestamp: string;
  estimation: CarbonEstimationResult;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly storageDir = join(process.cwd(), 'data', 'storage');

  async onModuleInit() {
    const dataDir = join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    await storage.init({
      dir: this.storageDir,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false,
      ttl: false,
    });
  }

  async saveEstimation(
    estimation: CarbonEstimationResult,
  ): Promise<EstimationRecord> {
    const newRecord: EstimationRecord = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      estimation,
    };

    await storage.setItem(`estimation-${newRecord.id}`, newRecord);
    return newRecord;
  }

  async getAllEstimations(): Promise<EstimationRecord[]> {
    const allItems = await storage.values();
    return allItems.filter(
      (item) =>
        typeof item === 'object' && item !== null && 'estimation' in item,
    ) as EstimationRecord[];
  }

  async getEstimationById(id: string): Promise<EstimationRecord | null> {
    return (await storage.getItem(`estimation-${id}`)) || null;
  }

  async clearAllEstimations(): Promise<void> {
    const allItems = await storage.values();
    const estimationItems = allItems.filter(
      (item) =>
        typeof item === 'object' && item !== null && 'estimation' in item,
    );

    const keys = await storage.keys();
    const estimationKeys = keys.filter(
      (key) => typeof key === 'string' && key.startsWith('estimation-'),
    );

    for (const key of estimationKeys) {
      await storage.removeItem(key);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}
