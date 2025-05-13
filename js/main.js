import navigator from './navigator.js';
import inicio from './inicio.js';
import { renderLogin } from './login.js';
import { renderRegister } from './register.js';
import { renderPerfil } from './perfil.js';
import { renderFooter } from './footer.js';
import { renderArtistas } from './artistas.js';

const navbar = document.getElementById("navbar");
const app = document.getElementById("app");

navigator(navbar);

const routes = {
  home: inicio,
  galeria: (el) => el.innerHTML = '<h2>Galería (próximamente)</h2>',
  artistas: (el) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
  
    if (!usuario) {
      // No logueado: pide iniciar sesión
      localStorage.setItem('destinoProtegido', 'artistas');
      alert('Acceso exclusivo a artistas. Si es fotógrafo inicie sesión.');
      window.location.hash = 'login';
    } else if (usuario.tipo_usuario !== 'fotografo') {
      // Logueado pero no es fotógrafo: acceso denegado
      alert('Acceso denegado.');
      window.location.hash = 'home';
    } else {
      // Es fotógrafo: puede ver la sección
      renderArtistas(el);
    }
  },
  login: renderLogin,
  register: renderRegister,
  perfil: renderPerfil,
};

const renderRoute = () => {
  const hash = window.location.hash.slice(1) || "home";
  app.innerHTML = "";

  // Re-renderiza el navbar en cada cambio de ruta
  navigator(navbar);

  if (routes[hash]) {
    routes[hash](app); // ← aquí se ejecuta renderLogin(app)
  } else {
    app.innerHTML = "<h2>404 - Sección no encontrada</h2>";
  }
};

renderFooter();

window.addEventListener("hashchange", renderRoute);
window.addEventListener("load", renderRoute);

