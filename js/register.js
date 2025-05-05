import { renderLogin } from './login.js';

export function renderRegister(container) {
  // Agregar el HTML básico del formulario de registro, incluyendo opciones para seleccionarse como Comprador o Fotógrafo
  container.innerHTML = `
    <section id="register" class="section active">
      <div class="form-container">
        <h2 id="registerTitle">Registro</h2>
        <div id="roleSelection">
          <p>¿Cómo deseas registrarte?</p>
          <button id="buyerBtn">Registrarse como Comprador</button>
          <button id="artistBtn">Registrarse como Fotógrafo</button>
        </div>
        <form id="registerForm" style="display: none;">
          <input type="hidden" id="regTipoUsuario">
          <input type="text" id="regNombre" placeholder="Nombre">
          <input type="text" id="regApellido1" placeholder="Primer apellido">
          <input type="text" id="regApellido2" placeholder="Segundo apellido (opcional)">
          <input type="email" id="regEmail" placeholder="Email">
          <input type="password" id="regPassword" placeholder="Contraseña">
          <select id="regPais">
            <option value="">Selecciona país</option>
            <option value="España">España</option>
            <option value="México">México</option>
            <option value="Argentina">Argentina</option>
          </select>
          <button type="button" id="registerBtn">Registrarse</button>
          <p class="error-message" id="registerError"></p>
        </form>
      </div>
    </section>
  `;

  const registerForm = document.getElementById('registerForm');
  const roleSelection = document.getElementById('roleSelection');
  const tipoUsuarioInput = document.getElementById('regTipoUsuario');
  const registerTitle = document.getElementById('registerTitle');

  // Borrar cualquier selección previa de tipo de usuario al entrar en la vista
  localStorage.removeItem('tipo_usuario');

  // Cargar tipo de usuario desde localStorage 
  const storedTipoUsuario = localStorage.getItem('tipo_usuario');
  if (storedTipoUsuario) {
    tipoUsuarioInput.value = storedTipoUsuario;
    registerForm.style.display = 'block'; 
    roleSelection.style.display = 'none'; 
    
    if (storedTipoUsuario === 'comprador') {
      registerTitle.textContent = 'Registro como Comprador';
    } else if (storedTipoUsuario === 'fotografo') {
      registerTitle.textContent = 'Registro como Fotógrafo';
    }
  }

  // Acción cuando el usuario elige registrarse como Comprador
  document.getElementById('buyerBtn').addEventListener('click', () => {
    tipoUsuarioInput.value = 'comprador'; // Establecer tipo de usuario como "comprador"
    registerTitle.textContent = 'Registro como Comprador'; // Cambiar el título
    localStorage.setItem('tipo_usuario', 'comprador'); // Guardar el tipo de usuario en localStorage
    roleSelection.style.display = 'none'; // Ocultar la selección de rol
    registerForm.style.display = 'block'; // Mostrar formulario
  });

  // Acción cuando el usuario elige registrarse como Fotógrafo
  document.getElementById('artistBtn').addEventListener('click', () => {
    tipoUsuarioInput.value = 'fotografo'; // Establecer tipo de usuario como "fotografo"
    registerTitle.textContent = 'Registro como Fotógrafo'; // Cambiar el título
    localStorage.setItem('tipo_usuario', 'fotografo'); // Guardar el tipo de usuario en localStorage
    roleSelection.style.display = 'none'; // Ocultar la selección de rol
    registerForm.style.display = 'block'; // Mostrar formulario
  });

  // Acción cuando el usuario hace clic en el botón "Registrarse"
  document.getElementById('registerBtn').addEventListener('click', () => {
    // Recoger los datos del formulario
    const nombre = document.getElementById('regNombre').value;
    const apellido1 = document.getElementById('regApellido1').value;
    const apellido2 = document.getElementById('regApellido2').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const pais = document.getElementById('regPais').value;
    const tipo_usuario = document.getElementById('regTipoUsuario').value; // Obtener el tipo de usuario desde el campo oculto

    // Verificar si el tipo de usuario está vacío (esto es una prevención)
    if (!tipo_usuario) {
      document.getElementById('registerError').textContent = 'Por favor selecciona un tipo de usuario';
      return;
    }

    // Enviar los datos a través de una solicitud fetch para registrar al usuario en el servidor
    fetch('php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido1, apellido2, email, password, pais, tipo_usuario })
    })
    .then(res => res.json()) // Convertir la respuesta a JSON
    .then(data => {
      if (data.success) {
        alert('Registro exitoso');
        localStorage.removeItem('tipo_usuario'); // Eliminar el tipo de usuario guardado en localStorage
        window.location.hash = 'login'; // Redirigir al login después del registro exitoso
      } else {
        document.getElementById('registerError').textContent = data.message; // Mostrar mensaje de error
      }
    })
    .catch(() => {
      document.getElementById('registerError').textContent = 'Error al registrar'; // Manejo de errores
    });
  });
}
