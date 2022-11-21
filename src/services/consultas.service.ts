import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsultaConsumo, EquiposLocacion, Lecturas} from '../Core/Interfaces/Datos.interface';
import {askDBO} from '../Core/Libraries/askDBO.library';
import {EquipoRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsultasService {
  constructor(
    @repository(EquipoRepository)
    private equipoRepository: EquipoRepository
  ) { }

  async ObtenerDatos(data: ConsultaConsumo) {
    let datos: Array<Lecturas> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_HISTORIAN} (h.date = '${data.fechaFinal}' or h.date = '${data.fechaFinal}') ORDER BY tag_name ASC `,
    );

    if (datos.length > 0) {
      return await datos;
    }

    return false;
  }

  async ObtenerEquiposPorPlanta() {
    let datos: Array<EquiposLocacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_EQUIPOS_LOCACION} l.tipoLocacionId = ${1} and e.locacionId = l.id ORDER BY tagName ASC `,
    );

    return await datos;

  }
}
