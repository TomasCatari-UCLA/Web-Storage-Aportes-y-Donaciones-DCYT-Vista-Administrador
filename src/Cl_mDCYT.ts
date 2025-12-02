import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150"; 
import Cl_mAporte, { iAporte } from "./Cl_mAporte.js";

interface iResultEquipos {
  objects: [iAporte] | null;
  error: string | false;
}

export default class Cl_mDCYT {
  private db: Cl_dcytDb;
  private aportes: Cl_mAporte[];

  readonly tbAporte: string = "dcyt_aportes";

  constructor() {
    this.db = new Cl_dcytDb({ aliasCuenta: "THE CODE RANGERS" });
    this.aportes = [];
  }

  cargar(callback: (error: string | false) => void): void {
    this.db.listRecords({
      tabla: this.tbAporte,
      callback: ({ objects, error }: iResultEquipos) => {
        if (error) callback(`Error cargando: ${error}`);
        else {
          this.llenarAportes(objects ?? []);
          callback(false);
        }
      },
    });
  }

  llenarAportes(datos: iAporte[]): void {
    this.aportes = [];
    datos.forEach((d) => this.aportes.push(new Cl_mAporte(d)));
  }

  dtAportes(): iAporte[] {
    return this.aportes.map((d) => d.toJSON());
  }

  buscarAporte(idAporte: string): Cl_mAporte | null {
    return this.aportes.find((d) => d.idAporte === idAporte) || null;
  }

  addAporte({
    dtAporte,
    callback,
  }: {
    dtAporte: iAporte;
    callback: (error: string | false) => void;
  }): void {
    let nuevoAporte = new Cl_mAporte(dtAporte);

    if (this.aportes.find((a) => a.idAporte === dtAporte.idAporte)) {
      callback(`El aporte con ID ${dtAporte.idAporte} ya existe.`);
      return;
    }
    if (nuevoAporte.aporteOk !== true) {
      callback(`Datos del aporte no son correctos: ${nuevoAporte.aporteOk}`);
      return;
    }
    this.db.addRecord({
      tabla: this.tbAporte,
      registroAlias: dtAporte.idAporte,
      object: nuevoAporte.toJSON(),
      callback: ({ objects: data, error }: any) => {
        if (!error) this.llenarAportes(data);
        callback?.(error);
      },
    });
  }

  editAporte({
    dtAporte,
    callback,
  }: {
    dtAporte: iAporte;
    callback: (error: string | boolean) => void;
  }): void {
    let aporteOriginal = this.aportes.find((e) => e.id === dtAporte.id);
    if (!aporteOriginal) {
      aporteOriginal = this.aportes.find(
        (e) => e.idAporte === dtAporte.idAporte
      );
    }
    if (!aporteOriginal) {
      callback(`No se encontró el aporte con ID ${dtAporte.idAporte}.`);
      return;
    }

    let tempValidador = new Cl_mAporte(dtAporte);
    if (tempValidador.aporteOk !== true) {
      callback(tempValidador.aporteOk as string);
      return;
    }

    aporteOriginal.idAporte = dtAporte.idAporte;
    aporteOriginal.fecha = dtAporte.fecha;
    aporteOriginal.tipo = dtAporte.tipo;
    aporteOriginal.descripcion = dtAporte.descripcion;
    aporteOriginal.monto = dtAporte.monto;
    aporteOriginal.nombreDonador = dtAporte.nombreDonador;
    aporteOriginal.tipoDonador = dtAporte.tipoDonador;

    const datosParaEnviar = {
      id: aporteOriginal.id,
      creadoEl: aporteOriginal.creadoEl,
      alias: aporteOriginal.alias,
      idAporte: aporteOriginal.idAporte,
      fecha: aporteOriginal.fecha,
      tipo: aporteOriginal.tipo,
      descripcion: aporteOriginal.descripcion,
      monto: aporteOriginal.monto,
      nombreDonador: aporteOriginal.nombreDonador,
      tipoDonador: aporteOriginal.tipoDonador,
    };

    this.db.editRecord({
      tabla: this.tbAporte,
      object: datosParaEnviar,
      callback: ({ error }: any) => {
        if (!error) {
          this.cargar((err) => {
            if (err) {
              callback(`Edicion OK, pero error al recargar la lista: ${err}`);
            } else {
              callback(false);
            }
          });
        } else {
        }
        callback(error);
      },
    });
  }

  deleteAporte({
    idAporte,
    callback,
  }: {
    idAporte: string;
    callback: (error: string | boolean) => void;
  }): void {
    let aporte = this.buscarAporte(idAporte);
    if (!aporte) aporte = this.aportes.find((e) => e.idAporte === "") || null;

    if (!aporte) {
      callback(`No existe el equipo.`);
      return;
    }
    this.db.deleteRecord({
      tabla: this.tbAporte,
      object: { id: aporte.id },
      callback: ({ objects: data, error }: any) => {
        if (!error) this.llenarAportes(data);
        callback?.(error);
      },
    });
  }
}
