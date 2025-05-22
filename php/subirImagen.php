<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $host = 'localhost';
    $db   = 'salita_de_estar';
    $user = 'root';
    $pass = '';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    $pdo = new PDO($dsn, $user, $pass, $options);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    // Recibir campos del formulario
    $id_usuario = $_POST['id_usuario'] ?? null;
    $titulo = $_POST['titulo'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $precio_base = $_POST['precio_base'] ?? 0;
    $palabras_clave = $_POST['palabras_clave'] ?? '';
    $id_categoria = $_POST['id_categoria'] ?? null;

    // Validaciones mínimas
    if (!$id_usuario || !$titulo || empty($_FILES['imagen']['tmp_name'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios']);
        exit;
    }

    // Subida de imagen
    $directorio = '../uploads/galerias/';
    if (!file_exists($directorio)) {
        mkdir($directorio, 0755, true);
    }

    $nombreArchivo = uniqid('imagen_') . '.' . pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $rutaDestino = $directorio . $nombreArchivo;

    if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
        exit;
    }

    $ruta_relativa = 'uploads/galerias/' . $nombreArchivo;

    // Insertar en la base de datos
    $stmt = $pdo->prepare("INSERT INTO fotografias (id_usuario, titulo, descripcion, precio_base, palabras_clave, id_categoria, ruta_archivo)
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id_usuario,
        $titulo,
        $descripcion,
        $precio_base,
        $palabras_clave,
        $id_categoria,
        $ruta_relativa
    ]);

    echo json_encode(['success' => true, 'message' => 'Imagen subida correctamente', 'ruta_archivo' => $ruta_relativa]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>