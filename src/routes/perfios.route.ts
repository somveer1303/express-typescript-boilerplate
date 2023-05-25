import { Router } from 'express';

import PerfiosController from '@/controllers/perfios.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class IndexRoute implements Routes {
  public path = '/bl';
  public router = Router();
  public PerfiosController = new PerfiosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/fileTransactionJob`, authMiddleware, this.PerfiosController.startFileTransactionsJob);
  }
}

export default IndexRoute;
