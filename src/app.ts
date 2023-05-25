import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as Sentry from '@sentry/node';

import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { config } from '@/config.server';
import createMongoConnection from '@utils/mongo';
import createSqlConnection from '@/utils/mysql';
import responseHandlers from '@/middlewares/response.middleware';

// Start cron jobs
import CronJobsService from '@/services/cronJobs/cronJobs.service';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = config.nodeEnv;
    this.port = config.port;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.sentrySetup();
    this.startCronJobs();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    createMongoConnection();
    createSqlConnection.create().then(() => {
      logger.info('Mysql connected');
    });
  }

  private initializeMiddlewares() {
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(morgan('dev', { stream }));
    this.app.use(cors({ origin: config.origin, credentials: config.credentials }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    // Custom Response Handlers
    this.app.use(responseHandlers);
    this.app.use(Sentry.Handlers.errorHandler());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private sentrySetup() {
    // Sentry Setup
    if (config.sentryDNS) {
      Sentry.init({
        dsn: config.sentryDNS,
        environment: config.nodeEnv,
      });
    }

    // Handle uncaught fatal errors
    process
      .on('uncaughtException', error => {
        logger.error(error);
        // Close the sentry client
        const client = Sentry.getCurrentHub().getClient();
        if (client) {
          client.captureException(error);
          client.close(30000).then(function () {
            process.exit(1);
          });
        }
      })
      .on('unhandledRejection', reason => {
        logger.error(reason);
        // Close the sentry client
        const client = Sentry.getCurrentHub().getClient();
        if (client) {
          client.captureEvent(reason);
          client.close(30000).then(function () {
            process.exit(1);
          });
        }
      });
  }

  private startCronJobs() {
    new CronJobsService();
  }
}

export default App;
