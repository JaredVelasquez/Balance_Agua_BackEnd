import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, ConsultaConsumoDetalle, ConsumoDetallePlanta, EquiposLocacion, Lecturas} from '../Core/Interfaces/Datos.interface';
import {ConsultasService} from './consultas.service';
import {OperacionesService} from './operaciones.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AlgoritmosService {
  constructor(
    @service(ConsultasService)
    private consultasService: ConsultasService,
    @service(OperacionesService)
    private operacionesService: OperacionesService,
  ) { }

  async lecturaTemporal(consulta: ConsultaConsumo) {
    let equipos: Array<EquiposLocacion> = await this.consultasService.ObtenerEquiposPorPlanta();
    let Lectura: Lecturas[] = [];
    let Lecturas: Lecturas[] = [];
    let LecturaTemporalInicial: Array<Lecturas> = [], LecturaTemporalFinal: Array<Lecturas> = [];
    let cantidadCiclos = 0;
    let fechaInicial = new Date(Date.parse(consulta.fechaInicial) - (3600000 * 6));
    for (let i = 0; i < equipos.length; i++) {
      if (equipos[i].tipoFuncionId <= 4) {
        Lectura = await this.consultasService.ObtenerDatos(consulta, equipos[i]);

        if (Lectura.length > 1) {
          for (let j = 0; j < Lectura.length; j++) {
            let LecturaReemplazo!: Lecturas;

            if (!Lectura[j].value) {

              let faltaFechaInicial = await this.IdentiLecturaFaltante(fechaInicial, Lectura[j].date);

              while (!LecturaReemplazo && j < Lectura.length && cantidadCiclos <= 192) {

                cantidadCiclos++;

                if (LecturaTemporalFinal.length < 1) {
                  LecturaTemporalFinal = await this.consultasService.ObtenerDatosEnCliclos(Lectura[j].date, equipos[i], cantidadCiclos, 15);
                }
                if (LecturaTemporalInicial.length < 1) {
                  LecturaTemporalInicial = await this.consultasService.ObtenerDatosEnCliclos(Lectura[j].date, equipos[i], cantidadCiclos, -15);
                }

                if (LecturaTemporalInicial.length > 0 && LecturaTemporalFinal.length > 0) {

                  LecturaReemplazo = await this.operacionesService.FormulaCiclicaLecturaTemporal(faltaFechaInicial, LecturaTemporalInicial[0], LecturaTemporalFinal[0], Lectura[j].date, cantidadCiclos, equipos[i]);
                  LecturaTemporalInicial.length = 0;
                  LecturaTemporalFinal.length = 0;
                }

              }
              cantidadCiclos = 0;
              if (LecturaReemplazo) {
                Lectura[j].value = LecturaReemplazo.value;
              }

            }

            Lecturas.push(
              Lectura[j]
            );

          }
        }
      }

      if (equipos[i].tipoFuncionId > 4 && equipos[i].tipoFuncionId <= 8) {
        Lectura = await this.consultasService.ObtenerLecturaPromedio(consulta, equipos[i]);
        Lecturas.push(
          {
            id: equipos[i].id,
            tag_name: equipos[i].tagName,
            date: new Date(consulta.fechaInicial),
            value: Lectura[0].value
          }
        );
        Lecturas.push(
          {
            id: equipos[i].id,
            tag_name: equipos[i].tagName,
            date: new Date(consulta.fechaFinal),
            value: Lectura[0].value
          }
        );
      }
    }

    return Lecturas;
  }

  async ConsumoPorPeriodosDeTiempo(esquemaDatos: ConsumoDetallePlanta[], data: ConsultaConsumoDetalle) {
    for (let i = 0; i < esquemaDatos.length; i++) {
      for (let j = 0; j < esquemaDatos[i].equipos.length; j++) {
        let Lecturas: Lecturas[] = await this.consultasService.ConsumoDetalle(esquemaDatos[i].equipos[j], data);
        for (let k = 0; k < Lecturas.length; k += 2) {
          if (Lecturas[k + 1]) {
            esquemaDatos[i].equipos[j].datos.push({
              id: Lecturas[k].id,
              tag_name: Lecturas[k].tag_name,
              descripcion: esquemaDatos[i].equipos[j].descripcion,
              tipoFuncionId: esquemaDatos[i].equipos[j].tipoFuncionId,
              fechaInicial: (Lecturas[k].date).toISOString(),
              fechaFinal: (Lecturas[k + 1].date).toISOString(),
              lecturaInicial: Lecturas[k].value,
              lecturaFinal: Lecturas[k + 1].value,
              consumo: Lecturas[k + 1].value - Lecturas[k].value,
            });
          }
        }
      }
    }
    return esquemaDatos;
  }

  async ConsumoPorPlantaPeriodosDeTiempo(esquemaDatos: ConsumoDetallePlanta[], data: ConsultaConsumoDetalle) {
    for (let i = 0; i < esquemaDatos.length; i++) {
      esquemaDatos[i].historicoLocacion = await this.consultasService.ObtenerConsumoPorPlanta(1, esquemaDatos[i].locacion.id, data);
      esquemaDatos[i].historicoProduccionLocacion = await this.consultasService.ObtenerConsumoPorPlanta(3, esquemaDatos[i].locacion.id, data);
    }
    return esquemaDatos;
  }

  async IdentiLecturaFaltante(fechaInicial: Date, fechaFaltante: Date) {

    if (Date.parse((fechaInicial).toString()) == Date.parse((fechaFaltante).toString())) {
      return true;
    }
    return false;
  }
}
