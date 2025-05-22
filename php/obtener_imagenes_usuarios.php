<?php
header('Content-Type: application/json');
include 'conexion.php';

$id_usuario = $_GET['id_usuario'] ?? null;

if (!$id_usuario) {
    echo json_encode(['success' => false, 'message' => 'Falta el ID del usuario']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM fotografias WHERE id_usuario = ?");
    $stmt->execute([$id_usuario]);
    $imagenes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'imagenes' => $imagenes]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de base de datos']);
}
?>