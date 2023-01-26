import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConsultaConsumo, ConsultaConsumoDetalle, ConsumoPlantaRangoFecha, DatosEquipoDetalle, EquipoRelacionado, EquiposLocacion, Lecturas, Locacion, LocacionRelacionada} from '../Core/Interfaces/Datos.interface';
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
      `${askDBO.GET_EQUIPOS_LOCACION} e.locacionId = l.id and e.estado = 1 ORDER BY tagName ASC `,
    );

    return await datos;

  }

  async ObternerLocaciones(tipoLocacionId: number) {
    let datos: Array<Locacion> = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LOCACION} estado = 1 ORDER BY l.descripcion ASC`,
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
  async ObtenerLecturaPromedio(data: ConsultaConsumo, Equipo: EquiposLocacion) {
    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LECTURA_PROMEDIO}  (h.date BETWEEN '${data.fechaInicial}' AND '${data.fechaFinal}') AND h.tag_name = '${Equipo.tagName}'  AND h.value IS NOT NULL) AS t`,
    );

    return await datos;
  }
  async ObtenerLocacionesRelacionadas() {
    let datos: Array<LocacionRelacionada> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_LOCACIONES_RELACIONADAS}`,
    );

    return await datos;
  }
  async ObtenerEquiposRelacionados() {
    let datos: Array<EquipoRelacionado> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_EQUIPOS_RELACIONADAS}`,
    );

    return await datos;
  }

  async ConsumoDetalle(equipo: DatosEquipoDetalle, data: ConsultaConsumoDetalle) {

    let datos: Array<Lecturas> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `${askDBO.GET_HISTORIAN}
      (h.date between '${data.fechaInicial}' AND '${data.fechaFinal}') and tag_name = '${equipo.tag_name}' ORDER BY tag_name ASC `,
    );

    return await datos;
  }

  async ObtenerConsumoPorPlanta(tipoFuncionId: number, locacion: number, data: ConsultaConsumoDetalle) {
    let datos: Array<ConsumoPlantaRangoFecha> = [];
    datos = await this.equipoRepository.dataSource.execute(
      `
      SELECT t.date date, CAST(sum(d.value-t.value)  AS DECIMAL(16,2)) diferencia from  (SELECT h.id, h.tag_name, h.date, h.value
      FROM Historian.dbo.Datos h
      WHERE (h.date between '${data.fechaInicial}' and '${data.fechaFinal}') and tag_name  IN(SELECT e.tagName FROM BalanceAgua.dbo.Equipo e, BalanceAgua.dbo.Locacion l WHERE  e.locacionId = l.id and  e.tipoFuncionId = ${tipoFuncionId} and e.estado = 1  and l.id = ${locacion}) ) AS t
      INNER JOIN (SELECT h.id, h.tag_name, h.date, h.value
      FROM Historian.dbo.Datos h
      WHERE (h.date between '${data.fechaInicial}' and '${data.fechaFinal}') and tag_name  IN(SELECT e.tagName FROM BalanceAgua.dbo.Equipo e, BalanceAgua.dbo.Locacion l WHERE  e.locacionId = l.id and  e.tipoFuncionId = ${tipoFuncionId} and e.estado = 1  and l.id =  ${locacion}) )
      AS d on t.tag_name=d.tag_name and t.date=DATEADD(MINUTE,-15,d.date)
      group by t.date
      `,
    );

    return await datos;

  }

}
