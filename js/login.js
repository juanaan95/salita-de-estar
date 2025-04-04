function renderLogin() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <section id="login" class="section active">
            <div class="form-container">
                <h2>Iniciar Sesión</h2>
                <input type="email" id="loginEmail" placeholder="Email">
                <input type="password" id="loginPassword" placeholder="Contraseña">
                <button onclick="loginUsuario()">Entrar</button>
                <p class="error-message" id="loginError"></p>
            </div>
        </section>
    `;
}

function loginUsuario() {
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
            alert('Bienvenido ' + data.usuario.nombre);
        } else {
            document.getElementById('loginError').textContent = data.message;
        }
    })
    .catch(err => {
        document.getElementById('loginError').textContent = 'Error de conexión';
    });
}

