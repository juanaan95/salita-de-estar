export function renderArtistas(app) {
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Recupera el usuario logueado

  // Si no hay usuario o no es fotógrafo, muestra advertencia
  if (!usuario || usuario.tipo_usuario !== 'fotografo') {
    app.innerHTML = `<p style="color: red;">Acceso exclusivo a artistas. Si es fotógrafo inicie sesión.</p>`;
    return;
  }

  // Clave única de almacenamiento por usuario (email como identificador)
  const userObrasKey = `artworks_${usuario.email}`;

  // Interfaz del formulario de subida
  app.innerHTML = `
  <div class="form-section">
        <h2>Subir Nueva Obra</h2>
        <form id="upload-form">
          <div class="form-group">
            <label for="title">Título de la obra:</label>
            <input type="text" id="title" required>
          </div>
          <div class="form-group">
            <label for="price">Precio (€):</label>
            <input type="number" id="price" required min="0">
          </div>
          <div class="form-group">
            <label for="price">Stock disponible:</label>
            <input type="number" id="stock" required min="0">
          </div>
          <div class="form-group">
            <label for="image">Imagen:</label>
            <input type="file" id="image" accept="image/png, image/jpeg">
          </div>
          <button type="submit">Subir</button>
        </form>
  
        <div class="uploaded-images" id="gallery">
          <h3>Galería fotográfica</h3>
        </div>
      </div>
  `;

  const form = document.getElementById('upload-form');
  const gallery = document.getElementById('gallery');

  let editIndex = null; // Índice de obra en modo edición

  mostrarObras(); // Mostrar las obras al cargar

  // Evento para gestionar la subida o edición de una obra
  form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const title = document.getElementById('title').value.trim();
    const price = document.getElementById('price').value;
    const stock = parseInt(document.getElementById('stock').value, 10); 
    const imageInput = document.getElementById('image');
    const file = imageInput.files[0];

    const obras = JSON.parse(localStorage.getItem(userObrasKey)) || [];

    // Modo edición
    if (editIndex !== null) {
      if (file) {
        // Si se cambia la imagen, la leemos como Base64
        const reader = new FileReader();
        reader.onload = async function (e) {
          obras[editIndex] = { title, price, imageBase64: e.target.result };
          localStorage.setItem(userObrasKey, JSON.stringify(obras));
          await enviarABaseDeDatos(obras[editIndex], editIndex);
          resetearFormulario();
        };
        reader.readAsDataURL(file);
      } else {
        // Si no se cambia la imagen, solo actualizamos título y precio
        obras[editIndex].title = title;
        obras[editIndex].price = price;
        obras[editIndex].stock = stock;
        localStorage.setItem(userObrasKey, JSON.stringify(obras));
        enviarABaseDeDatos(obras[editIndex], editIndex);
        resetearFormulario();
      }
      return;
    }

    // Validaciones al subir nueva obra
    if (!file) {
      alert('Selecciona una imagen');
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB máximo
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Formato no válido. Solo JPG o PNG.');
      return;
    }
    if (file.size > maxSize) {
      alert('La imagen supera el tamaño máximo de 2MB.');
      return;
    }

    // Leer la imagen Base64
    const reader = new FileReader();
    reader.onload = async function (e) {
      const imageBase64 = e.target.result;

      const nuevaObra = { title, price, stock, imageBase64 };
      obras.push(nuevaObra);
      localStorage.setItem(userObrasKey, JSON.stringify(obras));
      mostrarObras(); // Refrescar galería
      await enviarABaseDeDatos(nuevaObra);
      form.reset(); // Limpiar formulario
    };
    reader.readAsDataURL(file);
  });

  // Función para mostrar todas las obras del fotógrafo
  function mostrarObras() {
    gallery.innerHTML = '<h3>Galería fotográfica</h3>'; 
    const obras = JSON.parse(localStorage.getItem(userObrasKey)) || [];

    obras.forEach((obra, index) => {
      const div = document.createElement('div');
      div.classList.add('obra');

      const img = document.createElement('img');
      img.src = obra.imageBase64;
      img.style.maxWidth = "200px";

      const info = document.createElement('p');
      info.innerHTML = `<strong>${obra.title}</strong> - €${obra.price}`;

      // Botón de editar
      const editarBtn = document.createElement('button');
      editarBtn.textContent = 'Editar';
      editarBtn.addEventListener('click', () => editarObra(index));

      // Botón de eliminar
      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.addEventListener('click', () => eliminarObra(index));

      div.appendChild(img);
      div.appendChild(info);
      div.appendChild(editarBtn);
      div.appendChild(eliminarBtn);

      gallery.appendChild(div);
    });
  }

  // Cargar datos de una obra en el formulario para editar
  function editarObra(index) {
    const obras = JSON.parse(localStorage.getItem(userObrasKey)) || [];
    const obra = obras[index];
    document.getElementById('title').value = obra.title;
    document.getElementById('price').value = obra.price;
    document.getElementById('stock').value = obra.stock;
    editIndex = index;
    document.querySelector('#upload-form button[type="submit"]').textContent = 'Guardar Cambios';
  }

  // Eliminar una obra de la galería
  function eliminarObra(index) {
    if (confirm('¿Eliminar esta obra?')) {
      const obras = JSON.parse(localStorage.getItem(userObrasKey)) || [];
      obras.splice(index, 1); 
      localStorage.setItem(userObrasKey, JSON.stringify(obras));
      mostrarObras();
      resetearFormulario();
      eliminarDelServidor(index);
    }
  }

  // Resetear el formulario tras subir o editar
  function resetearFormulario() {
    form.reset();
    editIndex = null;
    document.querySelector('#upload-form button[type="submit"]').textContent = 'Subir';
    mostrarObras();
  }

  // Enviar nueva imagen o editar existente al servidor
  async function enviarABaseDeDatos(obra, index = null) {
    try {
      const response = await fetch('php/guardar_obra.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...obra, index })
      });
      const result = await response.json();
      console.log('Servidor:', result);
    } catch (err) {
      console.error('Error al guardar en servidor:', err);
    }
  }

  // Eliminar imagen del backend
  async function eliminarDelServidor(index) {
    try {
      await fetch('php/eliminar_obra.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
    } catch (err) {
      console.error('Error al eliminar del servidor:', err);
    }
  }
}
