/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import pino from 'pino';

import { BULL, BULL_OPTIONS } from './decorator/bull.decorator';
import { logger } from 'src/core/logger/logger';
import { Queue } from 'bullmq';

type BullTask = {
  type: 'bull';
  queue: Queue<any>;
  instance: Record<string, Function>;
  handler: Function;
};

type BullCronTask = {
  type: 'bullcron';
  queue: Queue<any>;
  instance: Record<string, Function>;
  handler: Function;
  intervalInSecs: number;
};

type Task = BullTask | BullCronTask;

@Injectable()
export class TaskScheduler implements OnModuleInit {
  private state: 'constructed' | 'running';

  private bullTasks: Task[] = [];

  private logger: pino.Logger;

  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {
    this.state = 'constructed';

    this.logger = logger.child({ context: 'TaskScheduler' });
  }

  // ===========================================================================
  // PUBLIC
  // ===========================================================================

  onModuleInit() {
    const instanceWrappers = this.discoveryService.getProviders();

    instanceWrappers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }

      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => {
          if (wrapper.isDependencyTreeStatic()) {
            this.lookupBull(instance, key);
          }
        },
      );
    });
  }

  // ===========================================================================
  // PRIVATE
  // ===========================================================================
  private lookupBull(instance: Record<string, Function>, methodName: string) {
    const methodRef = instance[methodName];

    if (this.reflector.get(BULL, methodRef)) {
      this.registerBull(instance, methodName, methodRef);
    }
  }

  private registerBull(
    instance: Record<string, Function>,
    methodName: string,
    methodRef: Function,
  ) {
    const className = instance.constructor.name;

    const [jobOptions, workerOptions] = this.reflector.get(
      BULL_OPTIONS,
      methodRef,
    );

    console.log(jobOptions, workerOptions);

    const queueName = `bull:${className}:${methodName}`;

    // TODO: create bull queue
    const queue = new Queue(queueName);

    this.bullTasks.push({
      type: 'bull',
      queue: queue,
      instance: instance,
      handler: methodRef,
    });

    // replace method by bull
    instance[methodName] = async function (this: any, ...args: any[]) {
      console.log('args', args);
      // const publisher = await queue.getPublisher();
      // await publisher.addJob({
      //   payload: args,
      // });
    };

    this.logger.info(
      {
        id: queueName,
      },
      'Registered queue.',
    );
  }

  async runHandlers(): Promise<void> {
    if (this.state !== 'constructed') return;

    // bulled queue handler
    for (const bull of this.bullTasks) {
      console.log(bull);
    }
  }
}
