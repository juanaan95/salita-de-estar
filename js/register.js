import { renderLogin } from './login.js'

export function renderRegister(container) {
  container.innerHTML = `
    <section id="register" class="section active">
      <div class="form-container">
        <h2>Registro</h2>
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
        <button id="registerBtn">Registrarse</button>
        <p class="error-message" id="registerError"></p>
      </div>
    </section>
  `;

  document.getElementById('registerBtn').addEventListener('click', () => {
    const nombre = document.getElementById('regNombre').value;
    const apellido1 = document.getElementById('regApellido1').value;
    const apellido2 = document.getElementById('regApellido2').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const pais = document.getElementById('regPais').value;

    fetch('php/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido1, apellido2, email, password, pais })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Registro exitoso');
        window.location.hash = 'login'; // redirige al login
      } else {
        document.getElementById('registerError').textContent = data.message;
      }
    })
    .catch(() => {
      document.getElementById('registerError').textContent = 'Error al registrar';
    });
  });
}
