import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, EquiposLocacion, Lecturas} from '../Core/Interfaces/Datos.interface';
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
    let LecturaTemporalInicial: Array<Lecturas> = [], LecturaTemporalFinal: Array<Lecturas> = [];
    let cantidadCiclos = 0;
    let fechaInicial = new Date(Date.parse(consulta.fechaInicial) - (3600000 * 6));
    for (let i = 0; i < equipos.length; i++) {
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

                LecturaReemplazo = await this.operacionesService.FormulaCiclicaLecturaTemporal(faltaFechaInicial, LecturaTemporalInicial[0], LecturaTemporalFinal[0], Lectura[j].date, cantidadCiclos);
                LecturaTemporalInicial.length = 0;
                LecturaTemporalFinal.length = 0;
              }

            }
            cantidadCiclos = 0;
            if (LecturaReemplazo) {
              Lectura[j].value = LecturaReemplazo.value;
            }

          }

        }
      }

    }
    return Lectura;

  }

  // async LecturaPonderada(FechaInicial: Date, Lectura: Lecturas, Equipo: EquiposLocacion, cantidadCiclos: number, valorDelCiclo: number, faltaFechaInicial: boolean, ) {

  // }

  // async LecturaEquivalente() {

  // }

  async IdentiLecturaFaltante(fechaInicial: Date, fechaFaltante: Date) {

    if (Date.parse((fechaInicial).toString()) == Date.parse((fechaFaltante).toString())) {
      return true;
    }
    return false;
  }

}
