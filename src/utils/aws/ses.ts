import * as AWS from 'aws-sdk';
import { config } from '@/config.server';

const sesConfig = {
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
};

export const AWS_SES = new AWS.SES(sesConfig);

export const sendEmail = emailData => {
  const params: AWS.SES.SendEmailRequest = {
    Source: emailData.senderEmail,
    Destination: {
      ToAddresses: emailData.recipientEmail,
    },
    Message: {
      Body: emailData.body,
      Subject: emailData.subject,
    },
  };
  return AWS_SES.sendEmail(params).promise();
};
