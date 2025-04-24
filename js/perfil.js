export function renderPerfil(container) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
  
    if (!usuario) {
      container.innerHTML = '<h2>No has iniciado sesión</h2>';
      return;
    }
  
    container.innerHTML = `
      <section class="section active">
        <div class="perfil-container">
          <h2>Bienvenido, ${usuario.nombre} ${usuario.apellido1}</h2>
          <p><strong>Email:</strong> ${usuario.email}</p>
          <p><strong>Tipo de usuario:</strong> ${usuario.tipo_usuario}</p>
          <button id="logoutBtn">Cerrar sesión</button>
        </div>
      </section>
    `;
  
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('usuario');
      alert('Sesión cerrada');
      window.location.hash = 'home';
    });
  }
  