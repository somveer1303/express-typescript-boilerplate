import LeadsModel from '@mysql/leads';
import ExcelJS from 'exceljs';
import { saveWorkbookAndUploadToS3, sendFileToEmailFromS3 } from '@services/common';
import { config } from '@/config.server';

import { EmailData } from '@interfaces/nodemailer.interface';
import { getDecryptedValue, getEncryptedValue } from '@/utils/AESEncryption';
import { decrypt, encrypt, generateKeys } from '@/utils/RSAEncryption';
class UserService {
  private leadModel = new LeadsModel();

  public async get(): Promise<any> {
    const test = await this.leadModel.get();
    const workbook = new ExcelJS.Workbook();
    const workSheet = workbook.addWorksheet('My Sheet');
    workSheet.addRows([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
    ]);

    const emailData: EmailData = {
      from: 'info@chqbook.com',
      to: ['somveer.sharma@chqbook.com'],
      subject: 'testing somveer',
      text: 'testing',
      attachments: [
        {
          filename: 'yes.xlsx',
        },
      ],
      body: {},
    };

    // await saveWorkbookAndUploadToS3({
    //   workbook,
    //   s3FilePath: config.aws.S3.s3Path,
    //   bucket: config.aws.S3.bucketName,
    // });

    // await sendFileToEmailFromS3({
    //   bucket: config.aws.S3.bucketName,
    //   pathKey: `${config.aws.S3.s3Path}/339aa276-01d5-47ea-9374-be64733e2eb7.xlsx`,
    //   fileName: 'test.xlsx',
    //   emailData,
    // });

    // Encrypt code example
    // const encrypt = getEncryptedValue('inputString');
    // console.log(getDecryptedValue(encrypt));
    // generateKeys();

    // const enc = encrypt('hello', config.rsaKeys.internal.publicKey, undefined);
    // console.log('enc', enc);
    // const dec = decrypt(enc, config.rsaKeys.internal.privateKey, undefined);
    // console.log('dec', dec);
    return {
      ok: true,
      data: {},
    };
  }
}

export default UserService;
