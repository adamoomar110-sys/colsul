<?php
// Endpoint API en PHP para guardar el registro de usuarios de Odonto Merlo en DonWeb
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido. Use POST."]);
    exit;
}

require_once __DIR__ . '/config.php';

$inputData = json_decode(file_get_contents("php://input"), true);

$nombre = trim($inputData['nombre'] ?? '');
$celular = trim($inputData['celular'] ?? '');
$usuario = trim($inputData['usuario'] ?? '');

if (empty($nombre) || empty($celular)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "El nombre y el celular son obligatorios."]);
    exit;
}

try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("INSERT INTO registros (nombre, celular, usuario, fecha_registro) VALUES (:nombre, :celular, :usuario, NOW())");
    $stmt->execute([
        ':nombre' => $nombre,
        ':celular' => $celular,
        ':usuario' => $usuario
    ]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Registro guardado exitosamente en DonWeb.",
        "id" => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al guardar el registro: " . $e->getMessage()
    ]);
}
