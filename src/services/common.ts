import { Workbook } from 'exceljs';
import { generateFileName, uploadToS3FromDisk, UploadFileToS3, getFileStream } from '@utils/aws/S3';
import { transporter } from '@utils/nodemailer';
import { logger } from '@utils/logger';
import { EmailData } from '@/interfaces/nodemailer.interface';

//TODO: add safe checks in all functions

interface SendFileToEmailFromS3 {
  bucket?: string;
  pathKey?: string;
  fileName?: string;
  emailData: EmailData;
}

interface SaveWorkbookAndUploadToS3 {
  workbook: Workbook;
  s3FilePath: string;
  bucket: string;
}

const sendEmail = (emailData: EmailData) =>
  transporter.sendMail(emailData, (err, info) => {
    if (err) {
      logger.error(`sendEmail: ${err.stack}`);
    }
    logger.info(`Email Sent, Envelope: ${info.envelope}, MessageId: ${info.messageId}`);
  });

export const uploadFileToS3 = async (file: UploadFileToS3) => await uploadToS3FromDisk(file);

// // Example code for sending email
// export const sendEmailExample = (fileName: string, filePath: string) => {
//   const data: EmailData = {
//     from: 'info@chqbook.com',
//     to: ['somveer.sharma@chqbook.com'],
//     subject: 'testing somveer',
//     text: 'testing',
//     attachments: [
//       {
//         filename: fileName,
//         path: filePath,
//       },
//     ],
//     body: {},
//   };

//   sendEmail(data);
// };

// Only single attachment is allowed for now.
// TODO: allowed multiple attachments
export const sendFileToEmailFromS3 = async (body: SendFileToEmailFromS3) => {
  const stream = await getFileStream(body.bucket, body.pathKey);
  body.emailData.attachments[0].content = stream;
  transporter.sendMail(body.emailData, (err, info) => {
    if (err) {
      logger.error(`sendEmail: ${err.stack}`);
    }
    logger.info(`Email Sent, Envelope: ${info.envelope}, MessageId: ${info.messageId}`);
  });
};

export const saveWorkbookAndUploadToS3 = async (body: SaveWorkbookAndUploadToS3) => {
  const fileName = generateFileName('xlsx');
  const localFilePath = `../${fileName}`;
  await body.workbook.xlsx.writeFile(localFilePath);
  try {
    await uploadFileToS3({ localFilePath, s3FilePath: body.s3FilePath, bucket: body.bucket });
  } catch (error) {
    logger.error(error.stack);
  }
};
