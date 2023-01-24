// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {post, requestBody, response} from '@loopback/rest';
import {ConsultaConsumo, ConsultaConsumoDetalle} from '../Core/Interfaces/Datos.interface';
import {ConsumoService} from '../services';

// import {inject} from '@loopback/core';


export class CustomRoutesController {
  constructor(
    @service(ConsumoService)
    private consumoService: ConsumoService,
  ) { }


  @post('/consumos')
  @response(200, {
    description: 'Usuario model instance',
  })
  async Consumos(
    @requestBody() data: ConsultaConsumo
  ): Promise<any> {
    return await this.consumoService.CalculoConsumo(data);
  }

  @post('/consumo-detalle')
  @response(200, {
    description: 'Usuario model instance',
  })
  async ConsumoDetalle(
    @requestBody() data: ConsultaConsumoDetalle
  ): Promise<any> {
    console.log(data);

    return await this.consumoService.DetalleConsumo(data);
    return true
  }
}
