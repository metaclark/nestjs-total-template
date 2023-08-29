import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { TaskScheduler } from './task-scheduler';

@Module({
  imports: [DiscoveryModule],
  providers: [TaskScheduler],
  exports: [],
})
export class TaskSchedulerModule {}
