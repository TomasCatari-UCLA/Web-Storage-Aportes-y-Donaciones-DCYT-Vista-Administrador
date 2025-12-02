import Cl_mAporte, { LISTA_TIPOS, LISTA_TIPO_DONADOR, } from "./Cl_mAporte.js";
import Cl_vAporte from "./Cl_vAporte.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vDCYT extends Cl_vGeneral {
    constructor() {
        super({ formName: "dcyt" });
        this.idAportePendiente = null;
        this.vAporte = new Cl_vAporte();
        this.vAporte.show({ ver: false });
        this.sectionDCYT = document.getElementById("dcyt");
        this.sectionResumen = document.getElementById("resumenAnalitico");
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.addAporte(),
        });
        this.btBuscar = this.crearHTMLButtonElement("btBuscar", {
            onclick: () => this.abrirBusqueda(),
        });
        this.btQuitarFiltro = this.crearHTMLButtonElement("btQuitarFiltro", {
            onclick: () => this.limpiarFiltro(),
        });
        this.btQuitarFiltro.innerText = "* Quitar Filtro";
        this.btEstadisticas = this.crearHTMLButtonElement("btEstadisticas", {
            onclick: () => this.mostrarResumenAnalitico(),
        });
        this.btCerrarResumen = document.getElementById("btCerrarResumen");
        this.btCerrarResumen.onclick = () => this.ocultarResumenAnalitico();
        this.divTabla = this.crearHTMLElement("divTabla", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarAportes(),
        });
        this.lblTotal = document.getElementById("lblTotalAportes");
        this.lblEfectivo = document.getElementById("lblEfectivo");
        this.lblEspecie = document.getElementById("lblEspecie");
        this.lblMontoTotal = document.getElementById("lblMontoTotal");
        // Conexiones Resumen
        this.tblTipoDonacion = document.getElementById("tbl_tipoDonacion");
        this.tblTipoDonador = document.getElementById("tbl_tipoDonador");
        this.tblTemporal = document.getElementById("tbl_temporal");
        this.kpiUnicos = document.getElementById("kpi_unicos");
        this.kpiMontoTotal = document.getElementById("kpi_montoTotal");
        this.kpiMax = document.getElementById("kpi_max");
        this.kpiMin = document.getElementById("kpi_min");
        this.kpiPromedio = document.getElementById("kpi_promedio");
        this.listaObservaciones = document.getElementById("listaObservaciones"); // NUEVO
        this.modalEliminar = document.getElementById("modalEliminar");
        this.btConfirmarSi = document.getElementById("btConfirmarSi");
        this.btConfirmarSi.onclick = () => this.ejecutarBorrado();
        this.btConfirmarNo = document.getElementById("btConfirmarNo");
        this.btConfirmarNo.onclick = () => this.ocultarModalBorrado();
        this.modalBuscar = document.getElementById("modalBuscar");
        this.inBusIdAporte = document.getElementById("bus_inIdAporte");
        this.inBusFecha = document.getElementById("bus_inFecha");
        this.slBusTipo = document.getElementById("bus_slTipo");
        this.inBusDescripcion = document.getElementById("bus_inDescripcion");
        this.inBusMonto = document.getElementById("bus_inMonto");
        this.inBusNomDonador = document.getElementById("bus_inNomDonador");
        this.slBusTipoDonador = document.getElementById("bus_slTipoDonador");
        this.llenarSelectBusqueda(this.slBusTipo, LISTA_TIPOS);
        this.llenarSelectBusqueda(this.slBusTipoDonador, LISTA_TIPO_DONADOR);
        this.btBuscarCancelar = document.getElementById("btBuscarCancelar");
        this.btBuscarCancelar.onclick = () => this.ocultarBusqueda();
        this.btBuscarAceptar = document.getElementById("btBuscarAceptar");
        this.btBuscarAceptar.onclick = () => this.ejecutarBusqueda();
    }
    set controlador(controlador) {
        super.controlador = controlador;
        this.vAporte.controlador = controlador;
    }
    get controlador() {
        return super.controlador;
    }
    llenarSelectBusqueda(select, datos) {
        select.innerHTML = '<option value="">(Todos)</option>';
        datos.forEach((dato) => {
            let option = document.createElement("option");
            option.value = dato;
            option.text = dato;
            select.add(option);
        });
    }
    mostrarAportes(listaFiltrada) {
        var _a;
        this.divTabla.innerHTML = "";
        let aportes = listaFiltrada ? listaFiltrada : (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtAportes;
        if (!aportes)
            return;
        if (listaFiltrada) {
            this.btQuitarFiltro.style.display = "flex";
            this.btBuscar.style.display = "flex";
            this.btAgregar.style.display = "none";
        }
        else {
            this.btQuitarFiltro.style.display = "none";
            this.btBuscar.style.display = "flex";
            this.btAgregar.style.display = "flex";
        }
        let listaParaStats = aportes;
        let total = listaParaStats.length;
        let efectivo = listaParaStats.filter((e) => e.tipo === "Efectivo").length;
        let especie = listaParaStats.filter((e) => e.tipo === "Especie").length;
        let montoTotal = listaParaStats
            .filter((e) => e.tipo === "Efectivo")
            .reduce((sum, e) => sum + e.monto, 0);
        if (this.lblTotal)
            this.lblTotal.innerHTML = total.toString();
        if (this.lblEfectivo)
            this.lblEfectivo.innerHTML = efectivo.toString();
        if (this.lblEspecie)
            this.lblEspecie.innerHTML = especie.toString();
        if (this.lblMontoTotal)
            this.lblMontoTotal.innerHTML = `Bs. ${montoTotal.toFixed(2)}`;
        let html = "";
        if (aportes.length === 0)
            html = `<div style="text-align:center; padding:20px; color:#666;">No se encontraron resultados 🔍</div>`;
        aportes.forEach((aporte, index) => {
            let claseColor = "txt-blue";
            if (aporte.tipo === "Efectivo")
                claseColor = "txt-green";
            if (aporte.tipo === "Especie")
                claseColor = "txt-yellow";
            html += `<div class="card">
                <div class="card-content">
                    <div class="card-title">${aporte.nombreDonador} (${aporte.tipoDonador})</div> 
                    <div class="card-detail"> <b>ID:</b> ${aporte.idAporte || "N/A"} | <b>Fecha:</b> ${new Cl_mAporte(aporte).fechaStr} | <b>Monto:</b> Bs. ${aporte.monto.toFixed(2)}</div>
                    <div class="card-status ${claseColor}"><span class="status-dot">●</span> ${aporte.tipo}: ${aporte.descripcion.substring(0, 40)}...</div>
                </div>
                <div class="card-actions">
                    <button class="action-link link-blue" id="dcyt_btConsultar_${index}"><span>👁️</span> Consultar</button>
                    <button class="action-link link-blue" id="dcyt_btEditar_${index}"><span>✏️</span> Editar</button>
                    <button class="action-link link-red" id="dcyt_btEliminar_${index}"><span>🗑️</span> Eliminar</button>
                </div>
               </div>`;
        });
        this.divTabla.innerHTML = html;
        aportes.forEach((aporte, index) => {
            let btnC = document.getElementById(`dcyt_btConsultar_${index}`);
            if (btnC)
                btnC.onclick = () => this.consultarAporte(aporte.idAporte);
            let btnE = document.getElementById(`dcyt_btEditar_${index}`);
            if (btnE)
                btnE.onclick = () => this.editAporte(aporte.idAporte);
            let btnD = document.getElementById(`dcyt_btEliminar_${index}`);
            if (btnD)
                btnD.onclick = () => this.pedirConfirmacion(aporte.idAporte);
        });
    }
    // --- LÓGICA DE RESUMEN ANALÍTICO ---
    mostrarResumenAnalitico() {
        var _a;
        this.sectionDCYT.style.display = "none";
        this.sectionResumen.style.display = "block";
        let todos = ((_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtAportes) || [];
        let total = todos.length;
        if (total === 0)
            return;
        // --- 1. TIPO DONACIÓN ---
        let efec = todos.filter((a) => a.tipo === "Efectivo");
        let espe = todos.filter((a) => a.tipo === "Especie");
        let montoEfec = efec.reduce((acc, curr) => acc + curr.monto, 0);
        let promEfec = efec.length > 0 ? (montoEfec / efec.length).toFixed(2) : "0.00";
        let porcEfectivo = ((efec.length / total) * 100).toFixed(1);
        let porcEspecie = ((espe.length / total) * 100).toFixed(1);
        this.tblTipoDonacion.innerHTML = `
        <tr><td>Efectivo</td><td>${efec.length}</td><td>${porcEfectivo}%</td><td>Bs. ${montoEfec.toFixed(2)}</td><td>Bs. ${promEfec}</td></tr>
        <tr><td>Especie</td><td>${espe.length}</td><td>${porcEspecie}%</td><td>N/A</td><td>N/A</td></tr>
        <tr style="font-weight:bold; background:#eee;"><td>TOTAL</td><td>${total}</td><td>100%</td><td>Bs. ${montoEfec.toFixed(2)} (Cash)</td><td>-</td></tr>
      `;
        // --- 2. TIPO DONADOR ---
        let natural = todos.filter((a) => a.tipoDonador === "Natural");
        let juridica = todos.filter((a) => a.tipoDonador === "Jurídico");
        let cashNat = natural
            .filter((a) => a.tipo === "Efectivo")
            .reduce((s, c) => s + c.monto, 0);
        let cashJur = juridica
            .filter((a) => a.tipo === "Efectivo")
            .reduce((s, c) => s + c.monto, 0);
        let promNat = natural.filter((a) => a.tipo === "Efectivo").length > 0
            ? (cashNat / natural.filter((a) => a.tipo === "Efectivo").length).toFixed(2)
            : "0.00";
        let promJur = juridica.filter((a) => a.tipo === "Efectivo").length > 0
            ? (cashJur / juridica.filter((a) => a.tipo === "Efectivo").length).toFixed(2)
            : "0.00";
        this.tblTipoDonador.innerHTML = `
        <tr><td>Naturales</td><td>${natural.length}</td><td>${((natural.length / total) *
            100).toFixed(1)}%</td><td>Bs. ${cashNat.toFixed(2)}</td><td>Bs. ${promNat}</td></tr>
        <tr><td>Jurídicas</td><td>${juridica.length}</td><td>${((juridica.length / total) *
            100).toFixed(1)}%</td><td>Bs. ${cashJur.toFixed(2)}</td><td>Bs. ${promJur}</td></tr>
      `;
        // --- 3. KPIs ---
        let unicos = new Set(todos.map((a) => a.nombreDonador.toLowerCase().trim()))
            .size;
        let montosEfectivo = efec.map((a) => a.monto);
        let max = montosEfectivo.length > 0 ? Math.max(...montosEfectivo) : 0;
        let min = montosEfectivo.length > 0 ? Math.min(...montosEfectivo) : 0;
        this.kpiUnicos.innerText = unicos.toString();
        this.kpiMontoTotal.innerText = "Bs. " + montoEfec.toFixed(2);
        this.kpiMax.innerText = "Bs. " + max.toFixed(2);
        this.kpiMin.innerText = "Bs. " + min.toFixed(2);
        this.kpiPromedio.innerText = "Bs. " + promEfec;
        // --- 4. TEMPORAL ---
        let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
        todos.forEach((a) => {
            let fStr = a.fecha.toString();
            if (fStr.length === 8) {
                let mes = parseInt(fStr.substring(4, 6));
                if (mes >= 1 && mes <= 3)
                    q1++;
                else if (mes >= 4 && mes <= 6)
                    q2++;
                else if (mes >= 7 && mes <= 9)
                    q3++;
                else if (mes >= 10 && mes <= 12)
                    q4++;
            }
        });
        this.tblTemporal.innerHTML = `
        <tr><td>Enero - Marzo (Q1)</td><td>${q1}</td></tr>
        <tr><td>Abril - Junio (Q2)</td><td>${q2}</td></tr>
        <tr><td>Julio - Septiembre (Q3)</td><td>${q3}</td></tr>
        <tr><td>Octubre - Diciembre (Q4)</td><td>${q4}</td></tr>
      `;
        // --- 5. OBSERVACIONES (GENERACIÓN DINÁMICA) ---
        let htmlObs = "";
        // Obs 1 y 2: Porcentajes
        htmlObs += `<li>El <b>${porcEfectivo}%</b> de las donaciones fueron en efectivo, permitiendo flexibilidad en compras.</li>`;
        htmlObs += `<li>El <b>${porcEspecie}%</b> fueron donaciones en especie (equipos, materiales, servicios).</li>`;
        // Obs 3: Análisis Jurídicas (Simulado según data)
        if (juridica.length > 0) {
            let jurEspecie = juridica.filter((j) => j.tipo === "Especie").length;
            if (jurEspecie >= juridica.length / 2) {
                htmlObs += `<li>Las personas jurídicas concentran aportes en infraestructura y equipamiento (Especie).</li>`;
            }
            else {
                htmlObs += `<li>Las personas jurídicas han aportado mayoritariamente recursos monetarios.</li>`;
            }
        }
        // Obs 4: Análisis Naturales
        if (natural.length > 0) {
            let natEfectivo = natural.filter((n) => n.tipo === "Efectivo").length;
            if (natEfectivo >= natural.length / 2) {
                htmlObs += `<li>Las personas naturales aportan principalmente en efectivo.</li>`;
            }
            else {
                htmlObs += `<li>Las personas naturales han diversificado sus aportes en especie.</li>`;
            }
        }
        // Obs 5: Mayor concentración temporal
        let trimestres = [q1, q2, q3, q4];
        let maxQ = Math.max(...trimestres);
        let nombreQ = "";
        if (maxQ === q1)
            nombreQ = "Primer trimestre (Ene-Mar)";
        else if (maxQ === q2)
            nombreQ = "Segundo trimestre (Abr-Jun)";
        else if (maxQ === q3)
            nombreQ = "Tercer trimestre (Jul-Sep)";
        else
            nombreQ = "Último trimestre (Oct-Dic)";
        htmlObs += `<li>Mayor concentración de donaciones en el <b>${nombreQ}</b> del año.</li>`;
        // Obs 6: Promedio
        htmlObs += `<li>Promedio de donación en efectivo: <b>${promEfec} Bs.</b></li>`;
        this.listaObservaciones.innerHTML = htmlObs;
    }
    ocultarResumenAnalitico() {
        this.sectionResumen.style.display = "none";
        this.sectionDCYT.style.display = "block";
    }
    // ... Resto de métodos (Búsqueda, CRUD) igual ...
    abrirBusqueda() {
        this.inBusIdAporte.value = "";
        this.inBusFecha.value = "";
        this.inBusDescripcion.value = "";
        this.inBusMonto.value = "";
        this.inBusNomDonador.value = "";
        this.slBusTipo.value = "";
        this.slBusTipoDonador.value = "";
        this.modalBuscar.style.display = "flex";
    }
    ocultarBusqueda() {
        this.modalBuscar.style.display = "none";
    }
    limpiarFiltro() {
        this.mostrarAportes();
    }
    ejecutarBusqueda() {
        var _a;
        let sIdAporte = this.inBusIdAporte.value.trim().toLowerCase();
        let sFecha = this.inBusFecha.value.replace(/-/g, "");
        let sTipo = this.slBusTipo.value;
        let sDescripcion = this.inBusDescripcion.value.trim().toLowerCase();
        let sMonto = this.inBusMonto.value.trim();
        let sNomDonador = this.inBusNomDonador.value.trim().toLowerCase();
        let sTipoDonador = this.slBusTipoDonador.value;
        let todos = ((_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtAportes) || [];
        let filtrados = todos.filter((e) => {
            let coincide = true;
            let eModel = new Cl_mAporte(e);
            if (sIdAporte && !e.idAporte.toLowerCase().includes(sIdAporte))
                coincide = false;
            if (sFecha && !eModel.fecha.toString().includes(sFecha))
                coincide = false;
            if (sTipo && e.tipo !== sTipo)
                coincide = false;
            if (sDescripcion && !e.descripcion.toLowerCase().includes(sDescripcion))
                coincide = false;
            if (sMonto && String(e.monto) !== sMonto)
                coincide = false;
            if (sNomDonador && !e.nombreDonador.toLowerCase().includes(sNomDonador))
                coincide = false;
            if (sTipoDonador && e.tipoDonador !== sTipoDonador)
                coincide = false;
            return coincide;
        });
        this.ocultarBusqueda();
        this.mostrarAportes(filtrados);
    }
    addAporte() {
        var _a;
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "aporte",
            opcion: opcionFicha.add,
        });
    }
    consultarAporte(idAporte) {
        var _a, _b;
        let aporte = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.aporte(idAporte);
        if (aporte)
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({
                vista: "aporte",
                opcion: opcionFicha.read,
                objeto: aporte,
            });
    }
    editAporte(idAporte) {
        var _a, _b;
        let aporte = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.aporte(idAporte);
        if (aporte)
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({
                vista: "aporte",
                opcion: opcionFicha.edit,
                objeto: aporte,
            });
    }
    pedirConfirmacion(idAporte) {
        this.idAportePendiente = idAporte;
        this.modalEliminar.style.display = "flex";
    }
    ocultarModalBorrado() {
        this.idAportePendiente = null;
        this.modalEliminar.style.display = "none";
    }
    ejecutarBorrado() {
        var _a;
        if (this.idAportePendiente !== null) {
            (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.deleteAporte({
                idAporte: this.idAportePendiente,
                callback: (error) => {
                    this.ocultarModalBorrado();
                    if (error)
                        alert("Error: " + error);
                    else
                        this.mostrarAportes();
                },
            });
        }
    }
    activarVista({ vista, opcion, objeto, }) {
        if (vista === "dcyt") {
            this.show({ ver: true });
            this.mostrarAportes();
            this.vAporte.show({ ver: false });
        }
        else {
            this.show({ ver: false });
            this.vAporte.show({ ver: true, aporte: objeto, opcion });
        }
    }
}
