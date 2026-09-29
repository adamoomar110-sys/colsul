<?php
// ============================================================
// API REGISTROS DE ACCESO - COLSUL POLICONSULTORIO
// Base de datos en Ferozo: a0170001_colsul
// Startup Aura por Omar Horacio Adamo
// Protegido con Credenciales de Programador
// ============================================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Admin-User, X-Admin-Key");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';
$pdo = getDBConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        checkDeveloperAuth();
        handleGetRegistros($pdo);
        break;
    case 'POST':
        // El alta de registro al ingresar a la app es pública
        handlePostRegistro($pdo);
        break;
    case 'DELETE':
        checkDeveloperAuth();
        handleDeleteRegistro($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido."]);
        break;
}

/**
 * Valida credenciales exclusivas de programador (Omar)
 * Usuario: 25177943
 * Contraseña: 123456
 */
function checkDeveloperAuth() {
    $validUser = '25177943';
    $validPass = '123456';

    $authUser = $_SERVER['HTTP_X_ADMIN_USER'] ?? '';
    $authPass = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';

    // Soporte para Basic Auth
    if (isset($_SERVER['PHP_AUTH_USER']) && isset($_SERVER['PHP_AUTH_PW'])) {
        $authUser = $_SERVER['PHP_AUTH_USER'];
        $authPass = $_SERVER['PHP_AUTH_PW'];
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Basic\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $decoded = base64_decode($matches[1]);
            if (strpos($decoded, ':') !== false) {
                list($u, $p) = explode(':', $decoded, 2);
                $authUser = $u;
                $authPass = $p;
            }
        }
    }

    // Soporte para parámetros de URL al abrirlo en el navegador
    if (isset($_GET['user']) && isset($_GET['pass'])) {
        $authUser = $_GET['user'];
        $authPass = $_GET['pass'];
    }

    if ($authUser === $validUser && $authPass === $validPass) {
        return true;
    }

    http_response_code(401);
    header('WWW-Authenticate: Basic realm="Zona Exclusiva Programador - Startup Aura"');
    echo json_encode([
        "success" => false,
        "message" => "Acceso restringido. Se requiere usuario y contraseña de programador para ver los datos de los usuarios."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function handleGetRegistros($pdo) {
    try {
        $stmt = $pdo->query("SELECT id, nombre, celular, usuario, fecha_registro FROM `registros` ORDER BY `fecha_registro` DESC LIMIT 500");
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
