export interface Lecturas {
  tag_name: string,
  date: string,
  value: number
}

export interface ConsultaConsumo {
  fechaInicial: string,
  fechaFinal: string,
}

export interface Locacion {
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
  }
}
