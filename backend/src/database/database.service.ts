import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import * as storage from 'node-persist';
import { CarbonEstimationResult } from '../carbon/types';
import * as fs from 'fs';

// Extend estimation with ID and timestamp
export interface EstimationRecord {
  id: string;
  timestamp: string;
  estimation: CarbonEstimationResult;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly storageDir = join(process.cwd(), 'data', 'storage');

  async onModuleInit() {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize node-persist storage
    await storage.init({
      dir: this.storageDir,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false,
      ttl: false,
    });
  }

  /**
   * Save a new estimation record to the database
   * @param estimation The carbon estimation result to save
   * @returns The saved estimation record with ID
   */
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

  /**
   * Get all estimation records
   * @returns Array of all estimation records
   */
  async getAllEstimations(): Promise<EstimationRecord[]> {
    const allItems = await storage.values();
    return allItems.filter(
      (item) =>
        typeof item === 'object' && item !== null && 'estimation' in item,
    ) as EstimationRecord[];
  }

  /**
   * Get estimation by ID
   * @param id The ID of the estimation to retrieve
   * @returns The estimation record or null if not found
   */
  async getEstimationById(id: string): Promise<EstimationRecord | null> {
    return (await storage.getItem(`estimation-${id}`)) || null;
  }

  /**
   * Clear all estimation records
   * @returns Promise<void>
   */
  async clearAllEstimations(): Promise<void> {
    // Get all keys
    const allItems = await storage.values();
    const estimationItems = allItems.filter(
      (item) =>
        typeof item === 'object' && item !== null && 'estimation' in item,
    );

    // Find estimation keys
    const keys = await storage.keys();
    const estimationKeys = keys.filter(
      (key) => typeof key === 'string' && key.startsWith('estimation-'),
    );

    // Remove all estimation records
    for (const key of estimationKeys) {
      await storage.removeItem(key);
    }
  }

  /**
   * Generate a simple unique ID
   * @returns A unique string ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}
