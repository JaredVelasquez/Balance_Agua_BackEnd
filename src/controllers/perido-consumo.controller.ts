import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PeriodosConsumo} from '../models';
import {PeriodosConsumoRepository} from '../repositories';

export class PeridoConsumoController {
  constructor(
    @repository(PeriodosConsumoRepository)
    public periodosConsumoRepository : PeriodosConsumoRepository,
  ) {}

  @post('/periodos-consumos')
  @response(200, {
    description: 'PeriodosConsumo model instance',
    content: {'application/json': {schema: getModelSchemaRef(PeriodosConsumo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosConsumo, {
            title: 'NewPeriodosConsumo',
            exclude: ['id'],
          }),
        },
      },
    })
    periodosConsumo: Omit<PeriodosConsumo, 'id'>,
  ): Promise<PeriodosConsumo> {
    return this.periodosConsumoRepository.create(periodosConsumo);
  }

  @get('/periodos-consumos/count')
  @response(200, {
    description: 'PeriodosConsumo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PeriodosConsumo) where?: Where<PeriodosConsumo>,
  ): Promise<Count> {
    return this.periodosConsumoRepository.count(where);
  }

  @get('/periodos-consumos')
  @response(200, {
    description: 'Array of PeriodosConsumo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PeriodosConsumo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PeriodosConsumo) filter?: Filter<PeriodosConsumo>,
  ): Promise<PeriodosConsumo[]> {
    return this.periodosConsumoRepository.find(filter);
  }

  @patch('/periodos-consumos')
  @response(200, {
    description: 'PeriodosConsumo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosConsumo, {partial: true}),
        },
      },
    })
    periodosConsumo: PeriodosConsumo,
    @param.where(PeriodosConsumo) where?: Where<PeriodosConsumo>,
  ): Promise<Count> {
    return this.periodosConsumoRepository.updateAll(periodosConsumo, where);
  }

  @get('/periodos-consumos/{id}')
  @response(200, {
    description: 'PeriodosConsumo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PeriodosConsumo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PeriodosConsumo, {exclude: 'where'}) filter?: FilterExcludingWhere<PeriodosConsumo>
  ): Promise<PeriodosConsumo> {
    return this.periodosConsumoRepository.findById(id, filter);
  }

  @patch('/periodos-consumos/{id}')
  @response(204, {
    description: 'PeriodosConsumo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PeriodosConsumo, {partial: true}),
        },
      },
    })
    periodosConsumo: PeriodosConsumo,
  ): Promise<void> {
    await this.periodosConsumoRepository.updateById(id, periodosConsumo);
  }

  @put('/periodos-consumos/{id}')
  @response(204, {
    description: 'PeriodosConsumo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() periodosConsumo: PeriodosConsumo,
  ): Promise<void> {
    await this.periodosConsumoRepository.replaceById(id, periodosConsumo);
  }

  @del('/periodos-consumos/{id}')
  @response(204, {
    description: 'PeriodosConsumo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.periodosConsumoRepository.deleteById(id);
  }
}
