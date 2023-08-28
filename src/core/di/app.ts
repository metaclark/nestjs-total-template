import { INestApplication } from '@nestjs/common';

let nestJSApp: INestApplication | undefined = undefined;

export function getNestApp(): INestApplication {
  if (!nestJSApp) throw new Error('App is not initialized');
  return nestJSApp;
}

export function setNestApp(app: INestApplication) {
  nestJSApp = app;
}
