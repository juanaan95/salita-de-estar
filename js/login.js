export function renderLogin(container) {
    container.innerHTML = `
      <section id="login" class="section active">
        <div class="form-container">
          <h2>Iniciar Sesión</h2>
          <input type="email" id="loginEmail" placeholder="Email">
          <input type="password" id="loginPassword" placeholder="Contraseña">
          <button id="loginBtn">Entrar</button>
          <p class="error-message" id="loginError"></p>
        </div>
      </section>
    `;
  
    document.getElementById('loginBtn').addEventListener('click', () => {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
  
      fetch('php/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Guardar usuario en localStorage
          localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
          const destinoProtegido = localStorage.getItem('destinoProtegido');
      
          if (destinoProtegido === 'artistas') {
            // Intentaban entrar a artistas
            if (data.usuario.tipo_usuario !== 'fotografo') {
              alert('Acceso denegado.');
              localStorage.removeItem('destinoProtegido');
              window.location.hash = 'home';
            } else {
              localStorage.removeItem('destinoProtegido');
              window.location.hash = 'artistas';
            }
          } else {
            // Login normal
            alert('Bienvenido ' + data.usuario.nombre);
            window.location.hash = 'perfil';
          }
      
        } else {
          document.getElementById('loginError').textContent = data.message;
        }
      })      
      .catch(() => {
        document.getElementById('loginError').textContent = 'Error de conexión';
      });
    });
  }
  
  