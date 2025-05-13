<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
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

    // Verifica si es una petición multipart (imagen subida)
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        exit;
    }

    $id_usuario = $_POST['id_usuario'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $instagram = $_POST['instagram'] ?? '';

    if (!$id_usuario || !$nombre || !$email) {
        echo json_encode(['success' => false, 'message' => 'Faltan campos']);
        exit;
    }

    // Obtener la imagen antigua del usuario
    $stmt = $pdo->prepare("SELECT imagen_perfil FROM usuarios WHERE id_usuario = ?");
    $stmt->execute([$id_usuario]);
    $usuario = $stmt->fetch();
    $imagen_antigua = $usuario['imagen_perfil'];

    $ruta_imagen = null;

    // Si hay nueva imagen
    if (!empty($_FILES['imagen_perfil']['tmp_name'])) {
        $directorio = '../uploads/perfiles/';
        if (!file_exists($directorio)) {
            mkdir($directorio, 0755, true);
        }

        $nombreArchivo = uniqid('perfil_') . '.' . pathinfo($_FILES['imagen_perfil']['name'], PATHINFO_EXTENSION);
        $rutaDestino = $directorio . $nombreArchivo;

        // Mover el archivo al servidor
        if (move_uploaded_file($_FILES['imagen_perfil']['tmp_name'], $rutaDestino)) {
            $ruta_imagen = 'uploads/perfiles/' . $nombreArchivo;

            // Eliminar imagen antigua si existe
            if ($imagen_antigua && file_exists('../' . $imagen_antigua)) {
                unlink('../' . $imagen_antigua);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen']);
            exit;
        }
    }

    // Actualizar datos
    $sql = "UPDATE usuarios SET nombre = ?, email = ?, instagram = ?" .
        ($ruta_imagen ? ", imagen_perfil = ?" : "") .
        " WHERE id_usuario = ?";

    $params = [$nombre, $email, $instagram];
    if ($ruta_imagen) $params[] = $ruta_imagen;
    $params[] = $id_usuario;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode([
        'success' => true,
        'message' => 'Perfil actualizado correctamente',
        'ruta_imagen' => $ruta_imagen
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>




