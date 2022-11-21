import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, EquiposLocacion} from '../Core/Interfaces/Datos.interface';
import {ConsultasService} from './consultas.service';

@injectable({scope: BindingScope.TRANSIENT})
export class AlgoritmosService {
  constructor(
    @service(ConsultasService)
    private consultasService: ConsultasService
  ) { }

  async lecturaTemporal(consulta: ConsultaConsumo) {
    let equipos: Array<EquiposLocacion> = await this.consultasService.ObtenerEquiposPorPlanta();

    for (let i = 0; i < equipos.length; i++) {

    }
  }
}
