export function renderFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer-salita');
  
    footer.innerHTML = `
      <section class="footer-container">
        <div class="footer-columns">
          <!-- Logo y descripción -->
          <div class="footer-col">
            <div class="footer-logo">
              <img src="tu-icono.svg" alt="Logo Salita de Estar" />
              <h2>SALITA DE ESTAR</h2>
            </div>
            <p>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat."
            </p>
            <p class="footer-copy">Copyright © 2025 SALITA DE ESTAR. All Rights Reserved.</p>
          </div>
  
          <!-- Navegación rápida -->
          <div class="footer-col">
            <h4>Navegación rápida</h4>
            <ul>
              <li>• Inicio</li>
              <li>• Colección destacada</li>
              <li>• Artistas</li>
              <li>• Categorías</li>
              <li>• Vender en Salita de estar</li>
              <li>• Contacto</li>
            </ul>
          </div>
  
          <!-- Soporte y legal -->
          <div class="footer-col">
            <h4>Soporte y legal</h4>
            <ul>
              <li>• Preguntas frecuentes (FAQ)</li>
              <li>• Términos y condiciones</li>
              <li>• Política de privacidad</li>
              <li>• Política de devoluciones</li>
            </ul>
          </div>
        </div>
  
        <!-- Indicadores -->
        <div class="footer-dots">
          <span></span><span></span><span></span><span></span>
        </div>
      </section>
    `;
    document.body.appendChild(footer);
  }
  