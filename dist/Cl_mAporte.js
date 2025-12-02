import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export const LISTA_TIPOS = ["Efectivo", "Especie"];
export const LISTA_TIPO_DONADOR = ["Natural", "Jurídico"];
export default class Cl_mAporte extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, idAporte, fecha, tipo, descripcion, monto, nombreDonador, tipoDonador, } = {
        id: null,
        creadoEl: null,
        alias: null,
        idAporte: "",
        fecha: 0,
        tipo: "Efectivo",
        descripcion: "",
        monto: 0,
        nombreDonador: "",
        tipoDonador: "Natural",
    }) {
        super({ id, creadoEl, alias });
        this._idAporte = "";
        this._fecha = 0;
        this._tipo = "Efectivo";
        this._descripcion = "";
        this._monto = 0;
        this._nombreDonador = "";
        this._tipoDonador = "Natural";
        this.idAporte = idAporte;
        this.fecha = fecha;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.monto = monto;
        this.nombreDonador = nombreDonador;
        this.tipoDonador = tipoDonador;
    }
    set idAporte(idAporte) {
        this._idAporte = idAporte;
    }
    get idAporte() {
        return this._idAporte;
    }
    set fecha(fecha) {
        this._fecha = +fecha;
    }
    get fecha() {
        return this._fecha;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    get tipo() {
        return this._tipo;
    }
    set descripcion(descripcion) {
        this._descripcion = descripcion;
    }
    get descripcion() {
        return this._descripcion;
    }
    set monto(monto) {
        this._monto = +monto;
    }
    get monto() {
        return this._monto;
    }
    set nombreDonador(nombreDonador) {
        this._nombreDonador = nombreDonador;
    }
    get nombreDonador() {
        return this._nombreDonador;
    }
    set tipoDonador(tipoDonador) {
        this._tipoDonador = tipoDonador;
    }
    get tipoDonador() {
        return this._tipoDonador;
    }
    get idOk() {
        return this.idAporte.length > 0;
    }
    get fechaOk() {
        return this.fecha > 0;
    }
    get tipoOk() {
        return LISTA_TIPOS.includes(this._tipo);
    }
    get descripcionOk() {
        return this.descripcion.length > 0;
    }
    get montoOk() {
        return this.monto >= 0;
    }
    get donadorOk() {
        return this.nombreDonador.length > 0;
    }
    get tipoDonadorOk() {
        return LISTA_TIPO_DONADOR.includes(this._tipoDonador);
    }
    get aporteOk() {
        if (!this.idOk)
            return "La ID no puede estar vacia.";
        if (!this.fechaOk)
            return "La fecha no puede estar vacia.";
        if (!this.tipoOk)
            return "El tipo de aporte no debe estar vacio.";
        if (!this.descripcionOk)
            return "La descripción no puede estar vacia.";
        if (!this.montoOk)
            return "El monto no puede estar vacio.";
        if (!this.donadorOk)
            return "El nombre del donador no puede estar vacio.";
        if (!this.tipoDonadorOk)
            return "El tipo de donador no debe estar vacio.";
        return true;
    }
    get fechaStr() {
        if (this._fecha <= 0 || this._fecha.toString().length !== 8) {
            return "Invalido";
        }
        const fechaStrNum = this._fecha.toString();
        const year = fechaStrNum.substring(0, 4);
        const month = fechaStrNum.substring(4, 6);
        const day = fechaStrNum.substring(6, 8);
        return `${year}-${month}-${day}`;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { idAporte: this.idAporte, fecha: this.fecha, tipo: this.tipo, descripcion: this.descripcion, monto: this.monto, nombreDonador: this.nombreDonador, tipoDonador: this.tipoDonador });
    }
}
