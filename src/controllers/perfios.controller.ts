import { NextFunction, Request } from 'express';
import PerfiosService from '@services/perfios.service';

import { CustomResponse } from '@/interfaces/response.interface';

class PerfiosController {
  public perfiosService = new PerfiosService();

  public startFileTransactionsJob = async (
    req: Request,
    res: CustomResponse,
    next: NextFunction,
  ): Promise<CustomResponse> => {
    try {
      const response = await this.perfiosService.startFileTransactionsJob();
      if (response.ok) {
        return res.success({});
      }
      return res.invalid({});
    } catch (error) {
      next(error);
    }
  };
}

export default PerfiosController;
