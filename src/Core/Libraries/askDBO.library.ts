export namespace askDBO {
  export const GET_HISTORIAN = `SELECT h.tag_name, h.date, h.value FROM Historian.dbo.Datos h WHERE `;
  export const GET_LOCACION = `SELECT l.id, l.descripcion, l.observacion, l.tipoLocacionId, l.estado FROM Locacion l WHERE `;
  export const GET_EQUIPOS_LOCACION = `SELECT e.locacionId, e.tagName, e.tipoEquipoId, e.tipoFuncionId, l.descripcion, l.tipoLocacionId FROM Equipo e, Locacion l WHERE`;
}
