import { IConfigApp, DeepPartial } from '@config/constraint';

const configProduction: DeepPartial<IConfigApp> = {
  port: 5656,
  logDir: '../logs',
};

module.exports = configProduction;
