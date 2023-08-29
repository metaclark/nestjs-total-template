/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { applyDecorators, SetMetadata } from '@nestjs/common';
import { JobsOptions, WorkerOptions } from 'bullmq';

export const BULL = 'BULL';
export const BULL_OPTIONS = 'BULL_OPTIONS';
export const BULL_WORKER_OPTIONS = 'BULL_WORKER_OPTIONS';

/**
 * Declare a method run using Bull.
 * Method arguments are used as the job payload.
 */
export function Bull(
  jobOptions?: JobsOptions,
  workerOptions?: WorkerOptions,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(BULL, true),
    SetMetadata(BULL_OPTIONS, [jobOptions, workerOptions]),
  );
}
