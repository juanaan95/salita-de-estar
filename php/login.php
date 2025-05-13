<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos']);
    exit;
}

try {
    // Conexión con la base salita_de_estar
    $host = 'localhost';
    $db   = 'salita_de_estar';
    $user = 'root';
    $pass = ''; // XAMPP
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    // Buscar usuario por email
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if (!$usuario) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit;
    }

    if (!password_verify($password, $usuario['contrasena_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
        exit;
    }

    if ($usuario['estado_cuenta'] !== 'activo') {
        echo json_encode(['success' => false, 'message' => 'Cuenta inactiva o suspendida']);
        exit;
    }

    if ($usuario['verificacion_email'] != 1) {
        echo json_encode(['success' => false, 'message' => 'Email no verificado']);
        exit;
    }

    // Si todo está bien
    echo json_encode([
        'success' => true,
        'message' => 'Login exitoso',
        'usuario' => [
            'id' => $usuario['id_usuario'],
            'email' => $usuario['email'],
            'tipo_usuario' => $usuario['tipo_usuario'],
            'nombre' => $usuario['nombre'],
            'apellido1' => $usuario['apellido1'],
            'apellido2' => $usuario['apellido2'],
            'imagenPerfil' => $usuario['imagen_perfil'], // Ruta de la imagen
            'instagram' => $usuario['instagram']
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>