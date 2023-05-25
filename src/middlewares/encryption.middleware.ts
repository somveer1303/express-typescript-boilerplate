import { decrypt } from '@/utils/RSAEncryption';

import { NextFunction, Request } from 'express';
import { config } from '@/config.server';
import { HttpException } from '@exceptions/HttpException';
import { CustomResponse } from '@/interfaces/response.interface';
import { logger } from '@utils/logger';
const payloadDecryptMiddleware = async (req: Request, res: CustomResponse, next: NextFunction) => {
  try {
    const chqbookAppId: string = req.header(config.headers.chqbookAppId);
    if (chqbookAppId && Object.values(config.chqbookAppIds).includes(chqbookAppId)) {
      const body = req.body;
      if (chqbookAppId === config.chqbookAppIds.app) {
        const decrypted = decrypt(body.data, config.rsaKeys.internal.privateKey, undefined);
        if (!decrypted) {
          logger.error('Received bad data');
          res.unauthorized({ msg: 'Received bad data' });
        }

        try {
          req.body = JSON.parse(decrypted);
        } catch (error) {
          logger.error(error);
        }
      }
      next();
    } else {
      logger.error('chqbookAppId header missing');
      next(new HttpException(403, 'chqbookAppId header missing'));
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(401, 'Wrong encryption token'));
  }
};

export default payloadDecryptMiddleware;
