import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'BalanceAgua',
  connector: 'mssql',
  url: 'mssql://sa:1234@IT-JVELASQUEZ/BalanceAgua',
  host: 'IT-JVELASQUEZ',
  port: 1433,
  user: 'sa',
  password: '1234',
  database: 'BalanceAgua'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BalanceAguaDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'BalanceAgua';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.BalanceAgua', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
