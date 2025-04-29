export function renderPerfil(container) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    container.innerHTML = '<h2>No has iniciado sesión</h2>';
    return;
  }

  const editPerfil = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const body = document.querySelector("body");
  
    const editPerfilBackground = document.createElement("div");
    editPerfilBackground.className = "editPerfilBackground";
  
    const editPerfilDiv = document.createElement("div");
    editPerfilDiv.classList.add("editPerfilDiv");
  
    editPerfilDiv.innerHTML = `
      <h3>Editar Perfil</h3>
      <form id="formEditarPerfil">
        <div>
          <label for="nuevoNombre">Nombre:</label>
          <input type="text" id="nuevoNombre" value="${usuario.nombre}">
        </div>
        <div>
          <label for="nuevoEmail">Email:</label>
          <input type="email" id="nuevoEmail" value="${usuario.email}">
        </div>
        <div>
          <label for="nuevoInstagram">Instagram:</label>
          <input type="text" id="nuevoInstagram" value="${usuario.instagram || ''}">
        </div>
        <div>
          <label for="nuevaImagenPerfil">Imagen de perfil:</label>
          <input type="file" id="nuevaImagenPerfil" accept="image/*">
        </div>
        <div>
          <button id="save" type="submit">Guardar cambios</button>
          <img src="./assets/x.png" alt="Cerrar" class="exit" style="cursor:pointer; width:20px; vertical-align:middle;">
        </div>
      </form>
    `;
  
    editPerfilBackground.append(editPerfilDiv);
    body.append(editPerfilBackground);
  
    // Evento cerrar
    const exit = document.querySelector(".exit");
    exit.addEventListener("click", () => {
      editPerfilBackground.remove();
    });
  
    // Evento guardar
    const form = document.getElementById("formEditarPerfil");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nuevoNombre = document.getElementById("nuevoNombre").value;
      const nuevoEmail = document.getElementById("nuevoEmail").value;
      const nuevoInstagram = document.getElementById("nuevoInstagram").value;
      const imagenInput = document.getElementById("nuevaImagenPerfil");
  
      // Leer imagen como base64 si se ha seleccionado
      if (imagenInput.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          usuario.imagenPerfil = reader.result;
          guardarCambios();
        };
        reader.readAsDataURL(imagenInput.files[0]);
      } else {
        guardarCambios();
      }
  
      function guardarCambios() {
        usuario.nombre = nuevoNombre;
        usuario.email = nuevoEmail;
        usuario.instagram = nuevoInstagram;
  
        localStorage.setItem("usuario", JSON.stringify(usuario));
        alert("Cambios guardados");
        editPerfilBackground.remove();
        window.location.reload(); // recarga para ver los cambios aplicados
      }
    });
  };  

  container.innerHTML = `
    <section class="section active">
      <div class="perfil-container">
        <img id="imagenPerfil" src="${usuario.imagenPerfil || './assets/perfil.png'}" alt="👤 Imagen de perfil">
        <h2>Bienvenido, ${usuario.nombre} ${usuario.apellido1}</h2>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Tipo de usuario:</strong> ${usuario.tipo_usuario}</p>

        <button id="editPerfil">Editar Perfil</button>
        <button id="logoutBtn">Cerrar sesión</button>
      </div>
    </section>
  `;

  // Evento para editar perfil
  document.getElementById('editPerfil').addEventListener('click', () => {
    editPerfil()
  });

  // Evento para cerrar sesión
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    alert('Sesión cerrada');
    window.location.hash = 'home';
  });
}
  