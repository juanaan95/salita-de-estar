<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include 'conexion.php'; // Ajusta la ruta si es necesario

try {
  $stmt = $pdo->prepare("SELECT id_categoria, nombre_categoria FROM categorias");
  $stmt->execute();
  $categorias = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "success" => true,
    "categorias" => $categorias
  ]);
} catch (PDOException $e) {
  echo json_encode([
    "success" => false,
    "message" => "Error al obtener categorías: " . $e->getMessage()
  ]);
}

