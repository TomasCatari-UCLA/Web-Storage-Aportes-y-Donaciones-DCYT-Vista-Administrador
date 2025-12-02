import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export type tipoAporte = "Efectivo" | "Especie";
export type tipoDonador = "Natural" | "Jurídico";

export const LISTA_TIPOS: tipoAporte[] = ["Efectivo", "Especie"];
export const LISTA_TIPO_DONADOR: tipoDonador[] = ["Natural", "Jurídico"];

export interface iAporte {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  idAporte: string;
  fecha: number;
  tipo: tipoAporte;
  descripcion: string;
  monto: number;
  nombreDonador: string;
  tipoDonador: tipoDonador;
}

export default class Cl_mAporte extends Cl_mTablaWeb {
  private _idAporte: string = "";
  private _fecha: number = 0;
  private _tipo: tipoAporte = "Efectivo";
  private _descripcion: string = "";
  private _monto: number = 0;
  private _nombreDonador: string = "";
  private _tipoDonador: tipoDonador = "Natural";

  constructor(
    {
      id,
      creadoEl,
      alias,
      idAporte,
      fecha,
      tipo,
      descripcion,
      monto,
      nombreDonador,
      tipoDonador,
    }: iAporte = {
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
    }
  ) {
    super({ id, creadoEl, alias });
    this.idAporte = idAporte;
    this.fecha = fecha;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.monto = monto;
    this.nombreDonador = nombreDonador;
    this.tipoDonador = tipoDonador;
  }

  set idAporte(idAporte: string) {
    this._idAporte = idAporte;
  }
  get idAporte(): string {
    return this._idAporte;
  }
  set fecha(fecha: number) {
    this._fecha = +fecha;
  }
  get fecha(): number {
    return this._fecha;
  }
  set tipo(tipo: tipoAporte) {
    this._tipo = tipo;
  }
  get tipo(): tipoAporte {
    return this._tipo;
  }
  set descripcion(descripcion: string) {
    this._descripcion = descripcion;
  }
  get descripcion(): string {
    return this._descripcion;
  }
  set monto(monto: number) {
    this._monto = +monto;
  }
  get monto(): number {
    return this._monto;
  }
  set nombreDonador(nombreDonador: string) {
    this._nombreDonador = nombreDonador;
  }
  get nombreDonador(): string {
    return this._nombreDonador;
  }
  set tipoDonador(tipoDonador: tipoDonador) {
    this._tipoDonador = tipoDonador;
  }
  get tipoDonador(): tipoDonador {
    return this._tipoDonador;
  }

  get idOk(): boolean {
    return this.idAporte.length > 0;
  }
  get fechaOk(): boolean {
    return this.fecha > 0;
  }
  get tipoOk(): boolean {
    return LISTA_TIPOS.includes(this._tipo);
  }
  get descripcionOk(): boolean {
    return this.descripcion.length > 0;
  }
  get montoOk(): boolean {
    return this.monto >= 0;
  }
  get donadorOk(): boolean {
    return this.nombreDonador.length > 0;
  }
  get tipoDonadorOk(): boolean {
    return LISTA_TIPO_DONADOR.includes(this._tipoDonador);
  }

  get aporteOk(): string | true {
    if (!this.idOk) return "La ID no puede estar vacia.";
    if (!this.fechaOk) return "La fecha no puede estar vacia.";
    if (!this.tipoOk) return "El tipo de aporte no debe estar vacio.";
    if (!this.descripcionOk) return "La descripción no puede estar vacia.";
    if (!this.montoOk) return "El monto no puede estar vacio.";
    if (!this.donadorOk) return "El nombre del donador no puede estar vacio.";
    if (!this.tipoDonadorOk) return "El tipo de donador no debe estar vacio.";
    return true;
  }

  get fechaStr(): string {
    if (this._fecha <= 0 || this._fecha.toString().length !== 8) {
      return "Invalido";
    }
    const fechaStrNum = this._fecha.toString();
    const year = fechaStrNum.substring(0, 4);
    const month = fechaStrNum.substring(4, 6);
    const day = fechaStrNum.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  toJSON(): iAporte {
    return {
      ...super.toJSON(),
      idAporte: this.idAporte,
      fecha: this.fecha,
      tipo: this.tipo,
      descripcion: this.descripcion,
      monto: this.monto,
      nombreDonador: this.nombreDonador,
      tipoDonador: this.tipoDonador,
    };
  }
}
