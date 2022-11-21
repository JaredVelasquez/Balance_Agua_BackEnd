import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Equipo,
  Locacion,
} from '../models';
import {EquipoRepository} from '../repositories';

export class EquipoLocacionController {
  constructor(
    @repository(EquipoRepository)
    public equipoRepository: EquipoRepository,
  ) { }

  @get('/equipos/{id}/locacion', {
    responses: {
      '200': {
        description: 'Locacion belonging to Equipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Locacion)},
          },
        },
      },
    },
  })
  async getLocacion(
    @param.path.number('id') id: typeof Equipo.prototype.id,
  ): Promise<Locacion> {
    return this.equipoRepository.locacionFk(id);
  }
}
