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
          <label for="nuevoApellido1">Apellido:</label>
          <input type="text" id="nuevoApellido1" value="${usuario.apellido1}">
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

    // Cerrar formulario
    document.querySelector(".exit").addEventListener("click", () => {
      editPerfilBackground.remove();
    });

    // Guardar cambios
    document.getElementById("formEditarPerfil").addEventListener("submit", (e) => {
      e.preventDefault();

      const nuevoNombre = document.getElementById("nuevoNombre").value;
      const nuevoApellido1 = document.getElementById("nuevoApellido1").value;
      const nuevoEmail = document.getElementById("nuevoEmail").value;
      const nuevoInstagram = document.getElementById("nuevoInstagram").value;
      const imagenInput = document.getElementById("nuevaImagenPerfil");

      const formData = new FormData();
      formData.append('id_usuario', usuario.id);
      formData.append('apellido1', nuevoApellido1);
      formData.append('nombre', nuevoNombre);
      formData.append('email', nuevoEmail);
      formData.append('instagram', nuevoInstagram);

      if (imagenInput.files[0]) {
        formData.append('imagen_perfil', imagenInput.files[0]);
      }

      fetch('http://localhost/L25_GestionGaleria-main/php/editarperfil.php', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Actualizar los datos del usuario en localStorage
            usuario.nombre = nuevoNombre;
            usuario.apellido1 = nuevoApellido1;
            usuario.email = nuevoEmail;
            usuario.instagram = nuevoInstagram;
            
            if (data.ruta_imagen) {
              usuario.imagenPerfil = data.ruta_imagen;  // Actualizar la ruta de la imagen
            }

            localStorage.setItem('usuario', JSON.stringify(usuario));
            alert('Cambios guardados correctamente');
            editPerfilBackground.remove();
            window.location.reload();  // Recargar la página para ver los cambios
          } else {
            alert('Error al guardar: ' + data.message);
          }
        })
        .catch(err => {
          console.error('Error al actualizar perfil:', err);
          alert('Error de conexión con el servidor');
        });
    });
  };

  const subirImagen = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const body = document.querySelector("body");

  const fondoModal = document.createElement("div");
  fondoModal.className = "editPerfilBackground";

  const modal = document.createElement("div");
  modal.className = "editPerfilDiv";

  modal.innerHTML = `
    <h3>Subir nueva imagen</h3>
    <form id="formSubirImagen">
      <div>
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" name="titulo" required>
      </div>
      <div>
        <label for="descripcion">Descripción:</label>
        <input type="text" id="descripcion" name="descripcion">
      </div>
      <div>
        <label for="precio_base">Precio base (€):</label>
        <input type="number" id="precio_base" name="precio_base" step="0.01">
      </div>
      <div>
        <label for="palabras_clave">Palabras clave (separadas por comas):</label>
        <input type="text" id="palabras_clave" name="palabras_clave">
      </div>
      <div>
        <label for="id_categoria">Categoría:</label>
        <select id="id_categoria" name="id_categoria" required>
          <option value="">Selecciona una Categoría...</option>
        </select>
      </div>
      <div>
        <label for="imagen">Archivo de imagen:</label>
        <input type="file" id="imagen" name="imagen" accept="image/*" required>
      </div>
      <div>
        <button type="submit">Subir Imagen</button>
        <img src="./assets/x.png" alt="Cerrar" class="exit" style="cursor:pointer; width:20px;">
      </div>
    </form>
  `;

  fetch("http://localhost/L25_GestionGaleria-main/php/obtener_categorias.php")
  .then(res => res.json())
  .then(data => {
    const select = document.getElementById("id_categoria");
    select.innerHTML = '<option value="">Selecciona una categoría</option>';

    if (data.success) {
      data.categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id_categoria;
        option.textContent = cat.nombre_categoria;
        select.appendChild(option);
      });
    } else {
      select.innerHTML = '<option value="">Error al cargar categorías</option>';
    }
  })
  .catch(err => {
    console.error("Error al cargar categorías:", err);
    document.getElementById("id_categoria").innerHTML = '<option value="">Error al conectar</option>';
  });


  fondoModal.append(modal);
  body.append(fondoModal);

  document.querySelector(".exit").addEventListener("click", () => {
    fondoModal.remove();
  });

  document.getElementById("formSubirImagen").addEventListener("submit", (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    formData.append("id_usuario", usuario.id);
    formData.append("titulo", form.titulo.value);
    formData.append("descripcion", form.descripcion.value);
    formData.append("precio_base", form.precio_base.value);
    formData.append("palabras_clave", form.palabras_clave.value);
    formData.append("id_categoria", form.id_categoria.value);
    formData.append("imagen", form.imagen.files[0]);

    fetch("http://localhost/L25_GestionGaleria-main/php/subirImagen.php", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Imagen subida con éxito");
        fondoModal.remove();
        window.location.reload(); // o recargar la galería si la tienes separada
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => {
      console.error("Error al subir imagen:", err);
      alert("Error de conexión con el servidor");
    });
  });
  };

  container.innerHTML = `
    <section class="section active">
      <div class="perfil-container">
        <div class="perfil-layout">
          <div class="perfil-izquierda">
            <img id="imagenPerfil" src="${usuario.imagenPerfil || './assets/perfil.png'}" alt="👤 Imagen de perfil">

            <div class="datos-usuario">
              <h1>${usuario.nombre}</h1>
              <h2>${usuario.apellido1} ${usuario.apellido2}</h2>
              <p>
                <img src="./assets/correo.png" class="icono" alt="Correo:">
                ${usuario.email}</p>
              <p>
                <img src="./assets/instagram.png" class="icono" alt="Instagram:">
                ${usuario.instagram}
              </p>
            </div>
          </div>

          <div class="perfil-derecha">
            <div class="botones-arriba">
              <button id="editPerfil">Editar Perfil</button>
              <button id="logoutBtn">Cerrar sesión</button>
            </div>
            <button id="sharebtn">Compartir</button>
            <button id="subirImagen">
              Subir Imagenes
              <img src="./assets/subir.png" class="icono" alt="">
            </button>
          </div>
        </div>
      </div>
      
      <div class="tu-galeria">
        <h1>Tu galeria:</h1>
        <div class="galeria-container">
        </div>
      </div>
    </section>
  `;

  // Cargar galería del usuario
  fetch(`http://localhost/L25_GestionGaleria-main/php/obtener_imagenes_usuarios.php?id_usuario=${usuario.id}`)
    .then(res => res.json())
    .then(data => {
      const galeria = document.querySelector('.galeria-container');
      if (data.success && data.imagenes.length > 0) {
        data.imagenes.forEach(img => {
          const card = document.createElement('div');
          card.className = 'imagen-card';
          card.innerHTML = `
            <img src="${img.ruta_archivo}" alt="${img.titulo}">
            <h4>${img.titulo}</h4>
            <p>${img.descripcion || ''}</p>
            <p><strong>${img.precio_base}€</strong></p>
            <div class="botones-img">
              <button class="editar-btn" data-id="${img.id_fotografia}">Editar</button>
              <button class="eliminar-btn" data-id="${img.id_fotografia}">Eliminar</button>
            </div>
          `;
          galeria.appendChild(card);
        });

      // Listeners para editar y eliminar
      document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.dataset.id;
          eliminarImagen(id);
        });
      });

      document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const id = e.target.dataset.id;
          editarImagen(id);
        });
      });

    } else {
      galeria.innerHTML = '<p>No hay imágenes subidas aún.</p>';
    }
  })
  .catch(err => {
    console.error('Error al cargar galería:', err);
    document.querySelector('.galeria-container').innerHTML = '<p>Error al cargar imágenes.</p>';
  });

  document.getElementById('editPerfil').addEventListener('click', () => {
    editPerfil();
  });
  
  document.getElementById('subirImagen').addEventListener('click', () => {
    subirImagen();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    alert('Sesión cerrada');
    window.location.hash = 'home';
  });
}