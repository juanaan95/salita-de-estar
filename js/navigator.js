const navigator = (father) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  father.innerHTML = `
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <img src="./assets/logo.png" alt="Logo" class="navbar-logo">
          <span class="navbar-brand">Salita de Estar</span>
        </div>
        <ul class="navbar-center">
          <li><a href="#home" data-section="home">Inicio</a></li>
          <li><a href="#galeria" data-section="galeria">Galería</a></li>
          <li><a href="#artistas" data-section="artistas">Artistas</a></li>
        </ul>
        <ul class="navbar-right">
          ${
            usuario
              ? `
                <li><a href="#perfil" data-section="perfil">👤 ${usuario.nombre}</a></li>
                <li><a href="#" id="logoutLink">Cerrar sesión</a></li>
              `
              : `
                <li><a href="#login" data-section="login">Login</a></li>
                <li><a href="#register" data-section="register">Registro</a></li>
              `
          }
        </ul>
      </div>
    </nav>
  `;

  // Si hay sesión activa, enlazamos botón de logout
  if (usuario) {
    const logoutLink = father.querySelector('#logoutLink');
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuario');
      window.location.hash = 'home';
      navigator(father); // vuelve a renderizar el navbar
    });
  }
};

export default navigator;