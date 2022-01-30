let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //muestra y oculta las secciones
  tabs(); //cambia la seccion cuando se presionen los tabs
  botonesPaginador(); //agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); //consultar API en backend de php

  nombreCliente(); //añade nombre de cliente
  idCliente();

  seleccionarFecha(); //añade la fecha en el objeto cita.fecha
  seleccionarHora(); //añade la hora en el objeto cita.hora

  mostrarResumen(); //muestra resumen de la cita
}

function mostrarSeccion() {
  //ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  //seleccionar la seccion con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);

  seccion.classList.add("mostrar");

  //quita la clase de actual a la seccion anterior
  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  //resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);

      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaSiguiente.classList.remove("ocultar");
    paginaAnterior.classList.remove("ocultar");
  }
  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;

    paso--;

    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;

    paso++;

    botonesPaginador();
  });
}

async function consultarAPI() {
  try {
    const url = "http://localhost:3030/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$ ${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;

    //es una funcion pero no lleva parentesis, si se colocan las parentesis se va a ejecutar sin ser llamada la func
    //servicioDiv.onclick = seleccionarServicio;

    //callback; evita que la funcion se ejecute al instante
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  //extrae el id del servicio clickeado
  const { id } = servicio;
  //extrae el arreglo de servicios de obj cita
  const { servicios } = cita;

  //identificar div al que se le dio click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  //comprobar si un servicio ya fue agregado con func => some
  if (servicios.some((agregado) => agregado.id === id)) {
    //ya está agregado, se elimina el articulo

    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    //no estaba agregado, se añade

    //crea una copia de los servicios y agrega un servicio nuevo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");

  inputFecha.addEventListener("input", function (e) {
    //getUTCDay muestra el dia de la semana en int
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      //seleccionó sabado(6) o domingo(0)
      e.target.value = "";

      mostrarAlerta("Fines de semana no permitidos", "error", ".formulario");
    } else {
      //fecha correcta, se guarda
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");

  inputHora.addEventListener("input", function (e) {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    if (hora < 10 || hora > 18) {
      //horas no validas menos de 10 o más de 18 hrs
      e.target.value = "";

      mostrarAlerta("Hora no valida", "error", ".formulario");
    } else {
      //horas validas, dentro de 11 a 17 hrs
      cita.hora = e.target.value;
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  //previene que se genera mas de una alerta
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  //scriptin para generar la alerta
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;

  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    //elimina la alerta después de 3 seg
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  //limpiar contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Faltan datos de servicios, fechas u hora",
      "error",
      ".contenido-resumen",
      false
    );
    return;
  }

  //scripting
  const { nombre, fecha, hora, servicios } = cita;

  //heading de resumen (servicios)
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  //iterando y mostrando servicios
  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;

    const contenedorServicio = document.createElement("DIV");

    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  //heading de resumen (Datos)
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";
  resumen.appendChild(headingCita);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  //formatear fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Nombre:</span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Nombre:</span> ${hora} Horas`;

  //boton para crear cita
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";

  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const { nombre, fecha, hora, servicios, id } = cita;
  const idServicios = servicios.map((servicio) => servicio.id);

  const datos = new FormData();

  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("usuarioId", id);
  datos.append("servicios", idServicios);

  try {
    //peticion a API
    const url = "http://localhost:3030/api/citas";

    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resultado = await respuesta.json();

    console.log(resultado.resultado);
    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada  correctamente",
      }).then(() => {
        setTimeout( () =>{

          window.location.reload();

        }, 3000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al guardar la cita'
    })
  }

  //no se pueden ver los datos por consola
  //se recomienda de la siguiente forma:
  //console.log([...datos]);
}
