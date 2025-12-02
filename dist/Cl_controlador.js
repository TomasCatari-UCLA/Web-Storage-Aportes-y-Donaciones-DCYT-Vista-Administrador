export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    // --- CRUD ---
    addAporte({ dtAporte, callback, }) {
        this.modelo.addAporte({ dtAporte, callback });
    }
    editAporte({ dtAporte, callback, }) {
        this.modelo.editAporte({ dtAporte, callback });
    }
    deleteAporte({ idAporte, callback, }) {
        this.modelo.deleteAporte({ idAporte, callback });
    }
    // --- CONSULTAS ---
    aporte(idAporte) {
        return this.modelo.buscarAporte(idAporte);
    }
    // CORRECCIÓN: Ordenar por idAporte y luego por Tipo
    get dtAportes() {
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
    activarVista({ vista, opcion, objeto, }) {
        this.vista.activarVista({ vista, opcion, objeto });
    }
}
