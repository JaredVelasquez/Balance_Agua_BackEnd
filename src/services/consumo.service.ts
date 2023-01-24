import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {ConsultaConsumo, ConsultaConsumoDetalle, ConsumoDetallePlanta, esquemaDatos} from '../Core/Interfaces/Datos.interface';
import {AlgoritmosService} from './algoritmos.service';
import {ConsultasService} from './consultas.service';
import {EsquemasService} from './esquemas.service';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsumoService {
  constructor(
    @service(AlgoritmosService)
    private algoritmosService: AlgoritmosService,
    @service(EsquemasService)
    private esquemasService: EsquemasService,
    @service(ConsultasService)
    private consultasService: ConsultasService,
  ) { }

  async CalculoConsumo(data: ConsultaConsumo) {
    let esquemaDatos: Array<esquemaDatos> = [];

    let Lecturas = await this.algoritmosService.lecturaTemporal(data);
    esquemaDatos = await this.esquemasService.ConsumoPorTipoLocacion(data, Lecturas);

    return esquemaDatos;
  }

  async DetalleConsumo(data: ConsultaConsumoDetalle) {
    let esquemaDatos: Array<ConsumoDetallePlanta> = [];
    esquemaDatos = await this.esquemasService.inizializarEsquemaConsumoDetalle();
    esquemaDatos = await this.algoritmosService.ConsumoPorPeriodosDeTiempo(esquemaDatos, data);
    esquemaDatos = await this.algoritmosService.ConsumoPorPlantaPeriodosDeTiempo(esquemaDatos, data);

    return esquemaDatos;
  }
}
