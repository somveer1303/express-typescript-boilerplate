import { createJob } from '@utils/cron.utils';

import PerfiosService from '@services/perfios.service';
import console from 'console';

class CronJobService {
  private perfiosService = new PerfiosService();

  constructor() {
    this.fileTransactionsJob();
  }
  private fileTransactionsJob() {
    // TODO: correct cron expressions
    // runs at every 30th minutes
    createJob('*/30 * * * *', this.perfiosService.startFileTransactionsJob);
  }
}

export default CronJobService;
