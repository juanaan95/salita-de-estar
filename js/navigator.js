const navigator = (father) => {
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
          <li><a href="#login" data-section="login">Login</a></li>
          <li><a href="#register" data-section="register">Registro</a></li>
          <li><a href="#perfil" data-section="perfil">Perfil</a></li>
        </ul>
      </div>
    </nav>
  `
}

export default navigator
