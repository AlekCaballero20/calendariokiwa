document.addEventListener("DOMContentLoaded", function () {
    /** 🔹 Enlaces CSV por hoja */
    const CSV_URLS = {
        "Administrativo": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=554015671&single=true&output=csv",
        "SG SST": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=127861962&single=true&output=csv",
        "Financiero": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=53774575&single=true&output=csv",
        "Atención al cliente y ventas": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1905446694&single=true&output=csv",
        "Cumpleaños": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1660182246&single=true&output=csv",
        "Académico": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1985584362&single=true&output=csv",
        "Eventos": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1499850460&single=true&output=csv",
        "Marketing y Publicidad": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1499850460&single=true&output=csv",
        "Festivos": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpp6NNcaoVA2FMUzJ7YvsGExxH1qvpWaG7RAFjwmNgVuBm6nDnEKBK8giV9TKKrR0KC18Ciovjaj7T/pub?gid=1042162490&single=true&output=csv"
    };

    let SHEET_NAME = "Académico"; // Hoja por defecto
    const calendarioDiv = document.getElementById("calendario");
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    let eventos = [];
    let festivos = [];

    /** 🔹 Función para cargar eventos de una hoja */
    function cargarEventos(hoja) {
        const url = CSV_URLS[hoja];
        eventos = [];

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const filas = data.split("\n").slice(1); // Saltar encabezado

                filas.forEach(fila => {
                    const [fecha, descripcion] = fila.split(",").map(campo => campo.trim());

                    if (fecha && descripcion) {
                        const [dia, mes, año] = fecha.split("/").map(Number);
                        eventos.push({ dia, mes, descripcion, hoja });
                    }
                });

                generarCalendario();
            })
            .catch(error => console.error(`Error al cargar eventos de ${hoja}:`, error));
    }

    /** 🔹 Función para cargar los festivos */
    function cargarFestivos() {
        const url = CSV_URLS["Festivos"];
        festivos = [];

        fetch(url)
            .then(response => response.text())
            .then(data => {
                const filas = data.split("\n").slice(1); // Saltar encabezado

                filas.forEach(fila => {
                    const [fecha, nombre] = fila.split(",").map(campo => campo.trim());

                    if (fecha && nombre) {
                        const [dia, mes, año] = fecha.split("/").map(Number);
                        festivos.push({ dia, mes, nombre });
                    }
                });

                // Después de cargar festivos, cargamos la hoja por defecto
                cargarEventos(SHEET_NAME);
            })
            .catch(error => console.error("Error al cargar festivos:", error));
    }

    /** 🔹 Función para generar el calendario */
    function generarCalendario() {
        calendarioDiv.innerHTML = "";

        let hoy = new Date();
        let diaHoy = hoy.getDate();
        let mesHoy = hoy.getMonth() + 1;

        for (let i = 0; i < 12; i++) {
            let mesDiv = document.createElement("div");
            mesDiv.classList.add("mes");

            let titulo = document.createElement("h3");
            titulo.textContent = meses[i];
            mesDiv.appendChild(titulo);

            let diasContainer = document.createElement("div");
            diasContainer.classList.add("dias-container");

            // Nombres de los días
            for (let dia of diasSemana) {
                let diaSemanaDiv = document.createElement("div");
                diaSemanaDiv.classList.add("dia-semana");
                diaSemanaDiv.textContent = dia;
                diasContainer.appendChild(diaSemanaDiv);
            }

            // Primer día del mes
            let fechaInicio = new Date(2025, i, 1);
            let primerDiaSemana = fechaInicio.getDay();

            // Espacios vacíos
            for (let j = 0; j < primerDiaSemana; j++) {
                let espacioVacio = document.createElement("div");
                espacioVacio.classList.add("dia", "vacio");
                diasContainer.appendChild(espacioVacio);
            }

            // Días del mes
            for (let d = 1; d <= diasPorMes[i]; d++) {
                let diaDiv = document.createElement("div");
                diaDiv.classList.add("dia");

                let numeroDia = document.createElement("span");
                numeroDia.textContent = d;
                diaDiv.appendChild(numeroDia);

                // Día actual
                if (d === diaHoy && i + 1 === mesHoy) {
                    diaDiv.classList.add("hoy");
                }

                // Festivos
                let festivo = festivos.find(f => f.dia === d && f.mes === i + 1);
                if (festivo) {
                    diaDiv.classList.add("festivo");
                    let festivoSpan = document.createElement("div");
                    festivoSpan.classList.add("evento", "evento-festivos");
                    festivoSpan.textContent = festivo.nombre;
                    diaDiv.appendChild(festivoSpan);
                }

                // Eventos
                let eventosDia = eventos.filter(e => e.dia === d && e.mes === i + 1);
                eventosDia.forEach(evento => {
                    let eventoSpan = document.createElement("div");
                    eventoSpan.classList.add("evento");
                    let claseHoja = evento.hoja.toLowerCase().replace(/\s+/g, "-");
                    eventoSpan.classList.add(`evento-${claseHoja}`);
                    eventoSpan.textContent = evento.descripcion;
                    diaDiv.appendChild(eventoSpan);
                });

                diasContainer.appendChild(diaDiv);
            }

            mesDiv.appendChild(diasContainer);
            calendarioDiv.appendChild(mesDiv);
        }
    }

    /** 🔹 Manejo de los botones */
    document.querySelectorAll(".btn-hoja").forEach(boton => {
        boton.addEventListener("click", function () {
            SHEET_NAME = this.dataset.hoja;
            cargarEventos(SHEET_NAME);
        });
    });

    /** 🔹 Botón "Cronograma Completo" */
    document.getElementById("btn-cronograma").addEventListener("click", function () {
        eventos = [];
        const promesas = Object.keys(CSV_URLS).filter(hoja => hoja !== "Festivos").map(hoja => {
            return fetch(CSV_URLS[hoja])
                .then(response => response.text())
                .then(data => {
                    const filas = data.split("\n").slice(1);
                    filas.forEach(fila => {
                        const [fecha, descripcion] = fila.split(",").map(campo => campo.trim());
                        if (fecha && descripcion) {
                            const [dia, mes, año] = fecha.split("/").map(Number);
                            eventos.push({ dia, mes, descripcion, hoja });
                        }
                    });
                })
                .catch(error => console.error(`Error al cargar ${hoja}:`, error));
        });

        Promise.all(promesas).then(() => generarCalendario());
    });

    /** 🔹 Inicialización: Cargar festivos y eventos iniciales */
    cargarFestivos();
});
