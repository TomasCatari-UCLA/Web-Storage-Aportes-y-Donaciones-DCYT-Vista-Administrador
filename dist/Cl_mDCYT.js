import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mAporte from "./Cl_mAporte.js";
export default class Cl_mDCYT {
    constructor() {
        this.tbAporte = "dcyt_aportes";
        this.db = new Cl_dcytDb({ aliasCuenta: "THE CODE RANGERS" });
        this.aportes = [];
    }
    cargar(callback) {
        this.db.listRecords({
            tabla: this.tbAporte,
            callback: ({ objects, error }) => {
                if (error)
                    callback(`Error cargando: ${error}`);
                else {
                    this.llenarAportes(objects !== null && objects !== void 0 ? objects : []);
                    callback(false);
                }
            },
        });
    }
    llenarAportes(datos) {
        this.aportes = [];
        datos.forEach((d) => this.aportes.push(new Cl_mAporte(d)));
    }
    dtAportes() {
        return this.aportes.map((d) => d.toJSON());
    }
    buscarAporte(idAporte) {
        return this.aportes.find((d) => d.idAporte === idAporte) || null;
    }
    addAporte({ dtAporte, callback, }) {
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
            callback: ({ objects: data, error }) => {
                if (!error)
                    this.llenarAportes(data);
                callback === null || callback === void 0 ? void 0 : callback(error);
            },
        });
    }
    editAporte({ dtAporte, callback, }) {
        let aporteOriginal = this.aportes.find((e) => e.id === dtAporte.id);
        if (!aporteOriginal) {
            aporteOriginal = this.aportes.find((e) => e.idAporte === dtAporte.idAporte);
        }
        if (!aporteOriginal) {
            callback(`No se encontró el aporte con ID ${dtAporte.idAporte}.`);
            return;
        }
        let tempValidador = new Cl_mAporte(dtAporte);
        if (tempValidador.aporteOk !== true) {
            callback(tempValidador.aporteOk);
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
            callback: ({ error }) => {
                if (!error) {
                    this.cargar((err) => {
                        if (err) {
                            callback(`Edicion OK, pero error al recargar la lista: ${err}`);
                        }
                        else {
                            callback(false);
                        }
                    });
                }
                else {
                }
                callback(error);
            },
        });
    }
    deleteAporte({ idAporte, callback, }) {
        let aporte = this.buscarAporte(idAporte);
        if (!aporte)
            aporte = this.aportes.find((e) => e.idAporte === "") || null;
        if (!aporte) {
            callback(`No existe el equipo.`);
            return;
        }
        this.db.deleteRecord({
            tabla: this.tbAporte,
            object: { id: aporte.id },
            callback: ({ objects: data, error }) => {
                if (!error)
                    this.llenarAportes(data);
                callback === null || callback === void 0 ? void 0 : callback(error);
            },
        });
    }
}
