import Cl_mDCYT from "./Cl_mDCYT.js";
import Cl_vDCYT from "./Cl_vDCYT.js";
import Cl_mAporte, { iAporte } from "./Cl_mAporte.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: Cl_mDCYT;
  public vista: Cl_vDCYT;

  constructor(modelo: Cl_mDCYT, vista: Cl_vDCYT) {
    this.modelo = modelo;
    this.vista = vista;
  }

  // --- CRUD ---
  addAporte({
    dtAporte,
    callback,
  }: {
    dtAporte: iAporte;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addAporte({ dtAporte, callback });
  }

  editAporte({
    dtAporte,
    callback,
  }: {
    dtAporte: iAporte;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editAporte({ dtAporte, callback });
  }

  deleteAporte({
    idAporte,
    callback,
  }: {
    idAporte: string;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteAporte({ idAporte, callback });
  }

  // --- CONSULTAS ---
  aporte(idAporte: string): Cl_mAporte | null {
    return this.modelo.buscarAporte(idAporte);
  }

  // CORRECCIÓN: Ordenar por idAporte y luego por Tipo
  get dtAportes(): iAporte[] {
    let dtAportes = this.modelo.dtAportes();

    dtAportes.sort((a, b) => {
      // 1. Primero comparamos las IDs
      const comparacionAporte = a.idAporte.localeCompare(b.idAporte);
      // Si las IDs son diferentes, retornamos ese orden
      if (comparacionAporte !== 0) {
        return comparacionAporte;
      }
      // 2. Si las IDs son iguales, comparamos el Tipo (Efectivo antes que Especie)
      if (a.tipo === "Efectivo" && b.tipo === "Especie") {
        return -1;
      }
      if (a.tipo === "Especie" && b.tipo === "Efectivo") {
        return 1;
      }
      // Si todo es igual
      return 0;
    });
    return dtAportes;
  }
  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mAporte;
  }): void {
    this.vista.activarVista({ vista, opcion, objeto });
  }
}
