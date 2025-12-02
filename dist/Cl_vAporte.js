import { LISTA_TIPOS, LISTA_TIPO_DONADOR, } from "./Cl_mAporte.js"; // CAMBIADO
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vAporte extends Cl_vGeneral {
    constructor() {
        super({ formName: "aporte" }); // CAMBIADO: ID del formulario en index.html
        this.opcion = opcionFicha.add;
        this._id = null;
        this.vistaFormulario = document.getElementById("aporte"); // CAMBIADO
        this.lblTitulo = document.getElementById("aporte_lblTitulo"); // CAMBIADO
        // Conexión de inputs para Aporte
        this.inIdAporte = this.crearHTMLInputElement("inIdAporte");
        this.inFecha = this.crearHTMLInputElement("inFecha");
        this.inDescripcion = this.crearHTMLInputElement("inDescripcion");
        this.inMonto = this.crearHTMLInputElement("inMonto");
        this.inNomDonador = this.crearHTMLInputElement("inNomDonador");
        this.slTipo = this.crearHTMLSelectElement("slTipo", {
            elementsSource: LISTA_TIPOS,
        }); // CAMBIADO
        this.slTipoDonador = this.crearHTMLSelectElement("slTipoDonador", {
            elementsSource: LISTA_TIPO_DONADOR,
        }); // CAMBIADO
        this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
            onclick: () => this.procesar(opcionFicha.add),
        });
        this.btGuardar = this.crearHTMLButtonElement("btGuardar", {
            onclick: () => this.procesar(opcionFicha.edit),
        });
        this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
            onclick: () => this.cerrar(),
        });
        this.vistaConsultar = document.getElementById("consultarAporte"); // CAMBIADO
        // Conexión de labels para Consulta de Aporte
        this.lblC_IdAporte = document.getElementById("consultar_lblIdAporte"); // CAMBIADO
        this.lblC_Fecha = document.getElementById("consultar_lblFecha"); // CAMBIADO
        this.lblC_Tipo = document.getElementById("consultar_lblTipo"); // CAMBIADO
        this.lblC_Descripcion = document.getElementById("consultar_lblDescripcion"); // CAMBIADO
        this.lblC_Monto = document.getElementById("consultar_lblMonto"); // CAMBIADO
        this.lblC_NomDonador = document.getElementById("consultar_lblNomDonador"); // CAMBIADO
        this.lblC_TipoDonador = document.getElementById("consultar_lblTipoDonador"); // CAMBIADO
        this.btVolver = document.getElementById("consultar_btVolver");
        if (this.btVolver)
            this.btVolver.onclick = () => this.cerrar();
    }
    show({ ver, aporte, opcion, }) {
        // CAMBIADO
        this.vistaFormulario.style.display = "none";
        this.vistaConsultar.style.display = "none";
        if (ver && opcion !== undefined) {
            this.opcion = opcion;
            this.btAceptar.style.display = "none";
            this.btGuardar.style.display = "none";
            this.inIdAporte.disabled = false; // CAMBIADO: Usar inIdAporte
            if (this.opcion === opcionFicha.add) {
                this.vistaFormulario.style.display = "block";
                this.lblTitulo.innerText = "Agregar Aporte"; // CAMBIADO
                this._id = null;
                this.btAceptar.style.display = "inline-block";
                this.limpiarCampos();
            }
            else if (this.opcion === opcionFicha.edit && aporte) {
                // CAMBIADO
                this.vistaFormulario.style.display = "block";
                this.lblTitulo.innerText = "Editar Aporte"; // CAMBIADO
                this._id = aporte.id; // CAMBIADO
                this.btGuardar.style.display = "inline-block";
                this.llenarCampos(aporte); // CAMBIADO
                this.inIdAporte.disabled = true; // CAMBIADO: Usar inIdAporte
            }
            else if (aporte) {
                // Mostrar la vista de consulta si se recibió un aporte (evita usar opcionFicha.read)
                this.vistaConsultar.style.display = "block";
                this.lblC_IdAporte.innerText = aporte.idAporte; // CAMBIADO
                this.lblC_Fecha.innerText = aporte.fechaStr; // CAMBIADO: usar fechaStr
                this.lblC_Tipo.innerText = aporte.tipo; // CAMBIADO
                this.lblC_Descripcion.innerText = aporte.descripcion; // CAMBIADO
                this.lblC_Monto.innerText = "Bs. " + aporte.monto.toFixed(2); // CAMBIADO: formato de moneda
                this.lblC_NomDonador.innerText = aporte.nombreDonador; // CAMBIADO
                this.lblC_TipoDonador.innerText = aporte.tipoDonador; // CAMBIADO
            }
        }
    }
    limpiarCampos() {
        // CAMBIADO: Campos de Aporte
        this.inIdAporte.value = "";
        this.inFecha.value = "";
        this.slTipo.selectedIndex = 0;
        this.inDescripcion.value = "";
        this.inMonto.value = "";
        this.inNomDonador.value = "";
        this.slTipoDonador.selectedIndex = 0;
    }
    llenarCampos(aporte) {
        // CAMBIADO
        // CAMBIADO: Campos de Aporte
        this.inIdAporte.value = aporte.idAporte;
        this.inFecha.value = aporte.fechaStr; // CAMBIADO: Usar el formato YYYY-MM-DD para el input type="date"
        this.slTipo.value = aporte.tipo;
        this.inDescripcion.value = aporte.descripcion;
        this.inMonto.value = String(aporte.monto);
        this.inNomDonador.value = aporte.nombreDonador;
        this.slTipoDonador.value = aporte.tipoDonador;
    }
    cerrar() {
        this.controlador.activarVista({ vista: "dcyt" });
    }
    procesar(accion) {
        // El input de fecha de HTML da "YYYY-MM-DD". Necesitas convertirlo a número (YYYYMMDD)
        const fechaInput = this.inFecha.value.replace(/-/g, ""); // "2025-10-30" -> "20251030"
        const datos = {
            // CAMBIADO
            id: this._id,
            creadoEl: null,
            alias: null,
            idAporte: this.inIdAporte.value, // CAMBIADO
            fecha: Number(fechaInput), // CAMBIADO: Conversión a número YYYYMMDD
            tipo: this.slTipo.value, // CAMBIADO
            descripcion: this.inDescripcion.value, // CAMBIADO
            monto: Number(this.inMonto.value), // CAMBIADO
            nombreDonador: this.inNomDonador.value, // CAMBIADO
            tipoDonador: this.slTipoDonador.value, // CAMBIADO
        };
        const callback = (error) => {
            if (error)
                alert("Error: " + error);
            else
                this.controlador.activarVista({ vista: "dcyt" }); // REDIRECCIÓN AL ÉXITO
        };
        if (accion === opcionFicha.add) {
            this.controlador.addAporte({ dtAporte: datos, callback }); // CAMBIADO: Llamar a addAporte
        }
        else {
            this.controlador.editAporte({ dtAporte: datos, callback }); // CAMBIADO: Llamar a editAporte
        }
    }
}
