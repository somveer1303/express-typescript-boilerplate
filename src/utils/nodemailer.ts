import nodemailer from 'nodemailer';
import * as AWS from 'aws-sdk';
import { AWS_SES } from '@utils/aws/ses';

// create Nodemailer SES transporter
export const transporter = nodemailer.createTransport({
  SES: AWS_SES,
});
