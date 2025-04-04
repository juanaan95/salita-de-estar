<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Recibir datos JSON
$data = json_decode(file_get_contents("php://input"), true);

$nombre = trim($data['nombre'] ?? '');
$apellido1 = trim($data['apellido1'] ?? '');
$apellido2 = trim($data['apellido2'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$tipo_usuario = trim($data['tipo_usuario'] ?? 'comprador');
$pais = trim($data['pais'] ?? null);

// Validación básica
if (!$nombre || !$apellido1 || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios']);
    exit;
}

try {
    // Conexión con la base salita_de_estar
    $host = 'localhost';
    $db   = 'salita_de_estar';
    $user = 'root';
    $pass = ''; // por defecto en XAMPP
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
        exit;
    }

    // Hashear la contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insertar usuario
    $stmt = $pdo->prepare("INSERT INTO usuarios 
        (id_usuario, nombre, apellido1, apellido2, email, contrasena_hash, tipo_usuario, fecha_registro, pais, estado_cuenta, verificacion_email) 
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), ?, 'activo', 1)");

    $stmt->execute([$nombre, $apellido1, $apellido2, $email, $passwordHash, $tipo_usuario, $pais]);

    echo json_encode(['success' => true, 'message' => 'Usuario registrado correctamente']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>