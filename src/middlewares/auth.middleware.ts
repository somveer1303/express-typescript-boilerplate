import { NextFunction, Response, Request } from 'express';
import { config } from '@/config.server';
import { HttpException } from '@exceptions/HttpException';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization =
      req.cookies[config.cookies.authorization] || req.header(config.headers.authorization);
    if (Authorization && Authorization === config.internalAccessToken) {
      next();
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
