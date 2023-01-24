import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BalanceAguaDataSource} from '../datasources';
import {PeriodosConsumo, PeriodosConsumoRelations} from '../models';

export class PeriodosConsumoRepository extends DefaultCrudRepository<
  PeriodosConsumo,
  typeof PeriodosConsumo.prototype.id,
  PeriodosConsumoRelations
> {
  constructor(
    @inject('datasources.BalanceAgua') dataSource: BalanceAguaDataSource,
  ) {
    super(PeriodosConsumo, dataSource);
  }
}
