// This should follow constraints.ts config interface
export default {
  port: 'PORT',
  nodeEnv: 'NODE_ENV',
  databaseUrlSql: 'DATABASE_URL_SQL',
  databaseUrlMongo: 'DATABASE_URL_MONGO',
  internalAccessToken: 'INTERNAL_ACCESS_TOKEN',
  aws: {
    region: 'AWS_REGION',
    accessKeyId: 'AWS_ACCESS_KEY_ID',
    secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    S3: {
      bucketName: 'AWS_S3_BUCKET_NAME',
      region: 'AWS_S3_REGION',
      accessKeyId: 'AWS_S3_ACCESS_KEY_ID',
      secretAccessKey: 'AWS_S3_SECRET_ACCESS_KEY',
      signatureVersion: 'AWS_S3_SIGNATURE_VERSION',
    },
    SES: {
      region: 'AWS_REGION',
      accessKeyId: 'AWS_ACCESS_KEY_ID',
      secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    },
  },
  encryption: {
    encryptionKey1: 'ENCRYPTION_KEY_1',
    encryptionKey2: 'ENCRYPTION_KEY_2',
  },
  rsaKeys: {
    internal: {
      publicKey: 'INTERNAL_PUBLIC_KEY',
      privateKey: 'INTERNAL_PRIVATE_KEY',
    },
    app: {
      publicKey: 'APP_PUBLIC_KEY',
    },
  },
  sentryDNS: 'SENTRY_DNS',
  redisUrl: 'REDIS_URL',
};
