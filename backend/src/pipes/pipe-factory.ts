import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export function createZodValidationPipe(schema: ZodSchema): PipeTransform {
  return new ZodValidationPipe(schema);
}

class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value) as unknown;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
