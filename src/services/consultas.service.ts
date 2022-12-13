import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsultaConsumo, EquiposLocacion, Lecturas, Locacion} from '../Core/Interfaces/Datos.interface';
import {askDBO} from '../Core/Libraries/askDBO.library';
import {EquipoRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsultasService {
  constructor(
    @repository(EquipoRepository)
    private equipoRepository: EquipoRepository
  ) { }

  async ObtenerDatos(data: ConsultaConsumo, Equipo: EquiposLocacion) {
    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_HISTORIAN} (h.date = '${data.fechaInicial}' OR h.date = '${data.fechaFinal}')  ORDER BY tag_name ASC `,
    );

    return await datos;
  }

  async ObtenerEquiposPorPlanta() {
    let datos: Array<EquiposLocacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_EQUIPOS_LOCACION} e.estado = 1 and l.tipoLocacionId = ${1} and e.locacionId = l.id ORDER BY tagName ASC `,
    );

    return await datos;

  }

  async ObternerLocaciones(tipoLocacionId: number) {
    let datos: Array<Locacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LOCACION} l.tipoLocacionId = ${tipoLocacionId} and estado = 1`,
    );

    return await datos;
  }

  async ObtenerDatosEnCliclos(fecha: Date, Equipo: EquiposLocacion, ciclos: number, tiempoCiclo: number) {

    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_HISTORIAN} (h.date = DATEADD(MINUTE,  ${ciclos * tiempoCiclo},'${(fecha).toISOString()}')) and h.tag_name = '${Equipo.tagName}'  and Value IS NOT NULL ORDER BY h.tag_name ASC `,
    );

    return await datos;

  }

}
