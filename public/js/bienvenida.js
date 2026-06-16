// Pantalla de bienvenida (index.html). Pide el nombre, crea el usuario (tipo cliente) en
// el backend y entra al flujo guardándolo en la sesión (con TTL).
import { mountHeader } from './nav.js';
import { crearUsuario } from './api.js';
import { guardarUsuario, obtenerUsuario, iniciarExpiracionPorInactividad } from './usuarioSesion.js';

mountHeader('inicio');

const inputNombre = document.getElementById('input-nombre');
const botonContinuar = document.getElementById('boton-continuar');
const errorNombre = document.getElementById('error-nombre');

function nombreEsValido(nombre) {
  return nombre.trim().length >= 2;
}

// Habilita/deshabilita el botón mientras se escribe (CU-5.1.1: mínimo 2 caracteres).
function validarNombre() {
  botonContinuar.disabled = !nombreEsValido(inputNombre.value);
  errorNombre.classList.add('hidden');
}

async function continuar() {
  const nombreUsuario = inputNombre.value.trim();
  if (!nombreEsValido(nombreUsuario)) return;

  botonContinuar.disabled = true;
  try {
    const usuario = await crearUsuario(nombreUsuario);
    guardarUsuario({ id: usuario.id, nombre: usuario.nombre });
    window.location.href = 'productos.html';
  } catch (error) {
    errorNombre.textContent = 'No se pudo guardar el nombre. Probá de nuevo.';
    errorNombre.classList.remove('hidden');
    botonContinuar.disabled = false;
  }
}

inputNombre.addEventListener('input', validarNombre);
inputNombre.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter' && nombreEsValido(inputNombre.value)) continuar();
});
botonContinuar.addEventListener('click', continuar);

// Si volvés a la bienvenida y la sesión sigue vigente, precargamos tu nombre.
const usuarioVigente = obtenerUsuario();
if (usuarioVigente) {
  inputNombre.value = usuarioVigente.nombre;
  botonContinuar.disabled = false;
}

// Si pasan 5 minutos sin actividad, se borra la sesión y se limpia el campo.
iniciarExpiracionPorInactividad(() => {
  inputNombre.value = '';
  botonContinuar.disabled = true;
});
