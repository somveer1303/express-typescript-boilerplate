import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

import redis from '@utils/ioredis.utils';

import { config } from '@/config.server';

import { serviceResponse } from '@interfaces/service.interface';
import { getFileStream, downloadS3AndUploadToPerfios } from '@utils/aws/S3';

class PerfiosService {
  public async startFileTransactionsJob(): Promise<serviceResponse> {
    const isJobRunning = await redis.get(config.redisKeys.fileTransactionsJob);
    if (!(isJobRunning && isJobRunning === '1')) {
      await redis.set(config.redisKeys.fileTransactionsJob, '1');
      // TODO: clean code and remove static code
      // download from s3 and then in callback upload to perfios
      const file = await downloadS3AndUploadToPerfios(
        config.aws.S3.bucketName,
        // TODO: make this variable
        `${config.aws.S3.s3Path}/bank_statement_1668581361.pdf`,
      );
      await redis.set(config.redisKeys.fileTransactionsJob, '0');
      return { ok: true };
    } else {
      console.log('job is already in progress');
      return { ok: true };
    }
  }
}

export default PerfiosService;
