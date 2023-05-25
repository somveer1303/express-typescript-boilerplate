import { IConfigApp } from '@config/constraint';

const config: IConfigApp = {
  port: 4000,
  logDir: '../logs',
  origin: '*',
  credentials: true,
  aws: {
    S3: {
      s3Path: 'users/insurances/uat/cronJobs',
    },
  },
  headers: {
    authorization: 'Authorization',
    chqbookAppId: 'chqbook-App-Id',
  },
  cookies: {
    authorization: 'Authorization',
  },
  chqbookAppIds: {
    app: 'com.chqbook.app',
    web: 'com.chqbook.web',
  },
  redisKeys: {
    fileTransactionsJob: 'fileTransactionsJob',
  },
  redisUrl: 'redis://localhost:6379',
};

export default config;
