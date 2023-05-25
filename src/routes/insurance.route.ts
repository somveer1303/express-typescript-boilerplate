import { Router } from 'express';
import InsuranceController from '@controllers/insurance.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import payloadEncryption from '@/middlewares/encryption.middleware';

class IndexRoute implements Routes {
  public path = '/insurance';
  public router = Router();
  public insuranceController = new InsuranceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.insuranceController.get);
    this.router.post(`${this.path}/postEncEg`, payloadEncryption, this.insuranceController.get);
  }
}

export default IndexRoute;
