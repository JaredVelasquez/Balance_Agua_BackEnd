import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Periodos_Consumo'}}
})
export class PeriodosConsumo extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    generated: 0,
    mssql: {columnName: 'consumoFrio', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO', generated: 0},
  })
  consumoFrio: number;

  @property({
    type: 'number',
    required: true,
    precision: 53,
    generated: 0,
    mssql: {columnName: 'proyeccionFrio', dataType: 'float', dataLength: null, dataPrecision: 53, dataScale: null, nullable: 'NO', generated: 0},
  })
  proyeccionFrio: number;

  @property({
    type: 'date',
    required: true,
    generated: 0,
    mssql: {columnName: 'fechaInicial', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  fechaInicial: string;

  @property({
    type: 'date',
    required: true,
    generated: 0,
    mssql: {columnName: 'fechaFinal', dataType: 'datetime', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  fechaFinal: string;

  @property({
    type: 'boolean',
    required: true,
    generated: 0,
    mssql: {columnName: 'estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: 0},
  })
  estado: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PeriodosConsumo>) {
    super(data);
  }
}

export interface PeriodosConsumoRelations {
  // describe navigational properties here
}

export type PeriodosConsumoWithRelations = PeriodosConsumo & PeriodosConsumoRelations;
