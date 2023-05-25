import Knex from 'knex';
import { config } from '@/config.server';
import { logger } from '@utils/logger';

export async function create() {
  const knex = Knex({
    client: 'mysql2',
    connection: config.databaseUrlSql,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
    acquireConnectionTimeout: 2000,
  });

  // Verify the connection before proceeding
  try {
    await knex.raw('SELECT now()');
    return knex;
  } catch (error) {
    logger.error(error);
    throw new Error('Unable to connect to mysql via Knex. Ensure a valid connection.');
  }
}

export default { create };
