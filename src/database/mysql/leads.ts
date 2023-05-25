import { Knex } from 'knex';
import { create as knex } from '@utils/mysql';

export default class LeadModel {
  private db: Knex<any, unknown[]>;

  constructor() {
    knex().then(db => {
      this.db = db;
    });
  }

  public async get(): Promise<any> {
    const result = await this.db.raw('SELECT now()');
    return result;
  }
}
