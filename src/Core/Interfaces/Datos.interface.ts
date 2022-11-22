export interface Lecturas {
  tag_name: string,
  date: Date,
  value: number
}

export interface ConsultaConsumo {
  fechaInicial: string,
  fechaFinal: string,
}

export interface Locacion {
  id: number,
  descripcion: string,
  observacion: string,
  tipoLocacionId: number,
  estado: boolean
}

export interface EquiposLocacion {
  locacionId: number,
  tipoEquipoId: number,
  tipoLocacionId: number,
  tipoFuncionId: number,
  tagName: string,
  descripcion: string,
}

export interface esquemaDatos {
  datos: {
    planta: Locacion,
    equipos: {
      lectura: Lecturas[],
      consumo: number,
    }
    consumototal: number
  }
}
