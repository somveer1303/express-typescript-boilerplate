import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { config } from '@/config.server';
import { v4 } from 'uuid';
import { Readable } from 'stream';
import FormData from 'form-data';
import axios from 'axios';
import { cwd } from 'process';
import path from 'path';

import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { dirname } from 'path';

export interface UploadFileToS3 {
  localFilePath: string;
  s3FilePath: string;
  bucket: string;
}

const s3Client = new S3Client({
  region: config.aws.S3.region,
  credentials: {
    accessKeyId: config.aws.S3.accessKeyId,
    secretAccessKey: config.aws.S3.secretAccessKey,
  },
});

export const getFileStream = async (bucket: string, pathKey: string): Promise<any> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: pathKey,
  });
  const data: GetObjectCommandOutput = await s3Client.send(command);
  return data.Body;
};

const s3bucket = new AWS.S3({
  signatureVersion: config.aws.S3.signatureVersion,
  accessKeyId: config.aws.S3.accessKeyId,
  secretAccessKey: config.aws.S3.secretAccessKey,
  credentials: {
    accessKeyId: config.aws.S3.accessKeyId,
    secretAccessKey: config.aws.S3.secretAccessKey,
  },
  region: config.aws.S3.region,
});

export function generateFileName(extension = 'xlsx'): string {
  return v4() + '.' + extension;
}

export function uploadToS3FromDisk(file: UploadFileToS3): Promise<any> {
  const bucket = file.bucket;
  const readStream: Readable = fs.createReadStream(file.localFilePath);
  const params: AWS.S3.PutObjectRequest = {
    Bucket: `${bucket}/${file.s3FilePath}`,
    Key: generateFileName(),
    Body: readStream,
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, function (err: Error, data: AWS.S3.ManagedUpload.SendData) {
      readStream.destroy();
      fs.unlink(file.localFilePath, err => {
        if (err) {
          return reject(err);
        }
      });
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
}

// TODO: get file extension from s3 object
// TODO: separate callback code from s3 file
// TODO; Make download synchronous
// TODO: remove static code
export const downloadS3AndUploadToPerfios = async (
  bucket: string,
  pathKey: string,
  path = '../',
): Promise<{ filePath: string }> => {
  const object = s3bucket.getObject({ Bucket: bucket, Key: pathKey });
  const fileName = generateFileName('pdf');
  const localFilePath = `${cwd()}/${fileName}`;
  const readStream = object.createReadStream();
  const writeStream = fs.createWriteStream(fileName);
  readStream.pipe(writeStream).on('finish', () => {
    const data = new FormData();
    data.append('file', fs.createReadStream(localFilePath));

    const configAxios = {
      method: 'post',
      url: 'https://demo.perfios.com/KuberaVault/api/v3/organisations/chqbook/transactions/9DLY1670273933307/files',
      headers: {
        'X-Perfios-Algorithm': 'PERFIOS-RSA-SHA256',
        'X-Perfios-Content-Sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        'X-Perfios-Date': '20221206T021205Z',
        'X-Perfios-Signature':
          '9cf79a5b31a4228f41042ffde89d175563bdde329430fb2e09bf705b0068086c0bcf40c1b749154c0c0ecf1b9bda610a7841d57c2be58997f674eff90b29f84633c28bc461e9bac3719721ceabd44aa73d1a546b011ed1eecf9d94c0df6e3cc54ac096209a87384eb5d77daf3d7c124a1311f386aa8542126a1447a64fd125713005cbdec723a4ef5fa0ad9d50162da1ce1880b3d261191d235a4e750e7be58fd001fd2c968ed31ded7909dfa830fc53a34d5fbc11d5c1c13b94dde114cd8a478922c43f0a107c3bb75883f9963e8d273348d00e2b9f0b66ae8b7854b7ec732d808ff60d7d849596d9e257b69d372f6e40a4ee0c1e4206376b8f2275733e03e23472d8da41ef69a047173cd39995bfdd957c70783b29a322e3515a258e6a57e28449c2828f4a45267203d8c9949e4b8aad4af5c4cd30ad45bc5cb665ca1e6fe9125c3dd70db001d3266dd82737c8f6cbbaa38624a628f3fcd555662259f673cdb4488f5c471f5724d60e7af865be05ed29dbbda4f6689752eed32965147a6e3c3a4f7b9fe160036616e4e340eaef091efa1969232d4dd6dc3ad12061f4c73eb790b1de3f912d37432ad95476fb0b47655af559cea4cf78d5dc0e32b46a6d9123ee894cc88e945b9536fe6d8a3be030368393e5ed60e129bdb2956834792a08aa64bded1a2d031f5839d616800a2dc975ebcee4e9592aa6fb780a55f368262059',
        'X-Perfios-Signed-Headers': 'host;x-perfios-content-sha256;x-perfios-date',
        Host: 'demo.perfios.com',
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = axios(configAxios)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        fs.unlink(localFilePath, err => {
          if (err) {
            console.log(err);
          }
        });
      })
      .catch(function (error) {
        console.log('error', error);
        fs.unlink(localFilePath, err => {
          if (err) {
            console.log(err);
          }
        });
      });
  });
  return { filePath: localFilePath };
};
