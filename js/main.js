import navigator from './navigator.js';
import inicio from './inicio.js';
import { renderLogin } from './login.js';
import { renderRegister } from './register.js';
import { renderPerfil } from './perfil.js';

const navbar = document.getElementById("navbar");
const app = document.getElementById("app");

navigator(navbar);

const routes = {
  home: inicio,
  galeria: (el) => el.innerHTML = '<h2>Galería (próximamente)</h2>',
  artistas: (el) => el.innerHTML = '<h2>Artistas (próximamente)</h2>',
  login: renderLogin,
  register: renderRegister,
  perfil: renderPerfil,
};

const renderRoute = () => {
  const hash = window.location.hash.slice(1) || "home";
  app.innerHTML = "";
  if (routes[hash]) {
    routes[hash](app); // ← aquí se ejecuta renderLogin(app)
  } else {
    app.innerHTML = "<h2>404 - Sección no encontrada</h2>";
  }
};

window.addEventListener("hashchange", renderRoute);
window.addEventListener("load", renderRoute);
