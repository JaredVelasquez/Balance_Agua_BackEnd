import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, esquemaDatos} from '../Core/Interfaces/Datos.interface';
import {AlgoritmosService} from './algoritmos.service';
import {EsquemasService} from './esquemas.service';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsumoService {
  constructor(
    @service(AlgoritmosService)
    private algoritmosService: AlgoritmosService,
    @service(EsquemasService)
    private esquemasService: EsquemasService,
  ) { }

  async CalculoConsumo(data: ConsultaConsumo) {
    let esquemaDatos: Array<esquemaDatos> = [];

    let Lecturas = await this.algoritmosService.lecturaTemporal(data);

    esquemaDatos = await this.esquemasService.ConsumoPorTipoLocacion(data, Lecturas);

    return esquemaDatos;
  }
}
