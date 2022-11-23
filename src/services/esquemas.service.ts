import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, EquiposLocacion, esquemaDatos, Lecturas} from '../Core/Interfaces/Datos.interface';
import {ConsultasService} from './consultas.service';

@injectable({scope: BindingScope.TRANSIENT})
export class EsquemasService {
  constructor(
    @service(ConsultasService)
    private consultasService: ConsultasService
  ) { }

  async ConsumoPorTipoLocacion(consulta: ConsultaConsumo, Lectura: Lecturas[]) {
    let Equipos = await this.consultasService.ObtenerEquiposPorPlanta();
    let Plantas = await this.consultasService.ObternerLocaciones(1);

    let EsquemaConsumos: esquemaDatos[] = [];

    for (let i = 0; i < Plantas.length; i++) {
      EsquemaConsumos.push(
        {
          datos: {
            locacion: {
              id: Plantas[i].id,
              descripcion: Plantas[i].descripcion,
              observacion: Plantas[i].observacion,
              tipoLocacionId: Plantas[i].tipoLocacionId,
              estado: true
            },
            equipos: {
              datos: []
            },
            consumototal: 0
          }
        }
      );
    }

    for (let i = 0; i < Lectura.length; i += 2) {
      for (let j = 0; j < Equipos.length; j++) {
        if (Equipos[j].tagName == Lectura[i].tag_name) {
          for (let k = 0; k < EsquemaConsumos.length; k++) {
            if (Equipos[i].locacionId == EsquemaConsumos[k].datos.locacion.id) {
              EsquemaConsumos[k].datos.equipos.datos.push({
                tag_name: Lectura[i].tag_name,
                descripcion: Equipos[j].descEquipo,
                tipoFuncionId: Equipos[j].tipoFuncionId,
                fechaInicial: consulta.fechaInicial,
                fechaFinal: consulta.fechaFinal,
                lecturaInicial: Lectura[i].value,
                lecturaFinal: Lectura[i + 1].value,
                consumo: Lectura[i + 1].value - Lectura[i].value
              }
              );
              EsquemaConsumos[k].datos.consumototal += Lectura[i + 1].value - Lectura[i].value;

            }
          }
        }
      }
    }

    return EsquemaConsumos;
  }

  async AsignacionConsumos(Lectura: Lecturas[], esquemaDatos: esquemaDatos[]) {

  }

  async Lectura(Equipo: EquiposLocacion, fecha: string) {

    let lectura: Lecturas = {
      tag_name: Equipo.tagName,
      date: new Date(fecha),
      value: 0
    }

    return lectura;
  }
}


