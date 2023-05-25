import { NextFunction, Request } from 'express';
import insuranceService from '@services/insurance.service';

import { CustomResponse } from '@/interfaces/response.interface';

class InsuranceController {
  public insuranceService = new insuranceService();
  public get = (req: Request, res: CustomResponse, next: NextFunction): Promise<CustomResponse> => {
    try {
      const response = this.insuranceService.get();

      return res.success({ data: { name: 'somveer' }, code: 200 });
    } catch (error) {
      next(error);
    }
  };
}

export default InsuranceController;
