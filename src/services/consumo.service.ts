import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ConsultaConsumo} from '../Core/Interfaces/Datos.interface';

@injectable({scope: BindingScope.TRANSIENT})
export class ConsumoService {
  constructor(/* Add @inject to inject parameters */) { }

  async CalculoConsumo(data: ConsultaConsumo) {
    return true;
  }
}
