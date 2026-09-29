<?php
// ============================================================
// API REGISTROS DE ACCESO - COLSUL POLICONSULTORIO
// Base de datos en Ferozo: a0170001_colsul
// Startup Aura por Omar Horacio Adamo
// ============================================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';
$pdo = getDBConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRegistros($pdo);
        break;
    case 'POST':
        handlePostRegistro($pdo);
        break;
    case 'DELETE':
        handleDeleteRegistro($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido."]);
        break;
}

function handleGetRegistros($pdo) {
    try {
        $stmt = $pdo->query("SELECT id, nombre, celular, usuario, fecha_registro FROM `registros` ORDER BY `fecha_registro` DESC LIMIT 200");
        $rows = $stmt->fetchAll();

        echo json_encode([
            "success" => true,
            "count" => count($rows),
            "registros" => $rows
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al obtener registros: " . $e->getMessage()]);
    }
}

function handlePostRegistro($pdo) {
    $inputData = json_decode(file_get_contents("php://input"), true);

    $nombre = trim($inputData['nombre'] ?? '');
    $celular = trim($inputData['celular'] ?? '');
    $usuario = trim($inputData['usuario'] ?? '');

    if (empty($nombre) || empty($celular)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "El nombre y el celular son obligatorios."]);
        return;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO `registros` (`nombre`, `celular`, `usuario`, `fecha_registro`) VALUES (:nombre, :celular, :usuario, NOW())");
        $stmt->execute([
            ':nombre' => $nombre,
            ':celular' => $celular,
            ':usuario' => $usuario
        ]);

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Registro guardado exitosamente en MySQL Ferozo.",
            "id" => $pdo->lastInsertId()
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al guardar el registro en MySQL: " . $e->getMessage()
        ]);
    }
}

function handleDeleteRegistro($pdo) {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID inválido."]);
        return;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM `registros` WHERE `id` = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["success" => true, "message" => "Registro eliminado."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al eliminar registro: " . $e->getMessage()]);
    }
}
