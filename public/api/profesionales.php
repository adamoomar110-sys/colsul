<?php
// ============================================================
// API PROFESIONALES / MÉDICOS - COLSUL POLICONSULTORIO
// Base de datos en Ferozo: a0170001_colsul
// Startup Aura por Omar Horacio Adamo
// ============================================================

require_once __DIR__ . '/config.php';
$pdo = getDBConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    case 'DELETE':
        handleDelete($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
        break;
}

function handleGet($pdo) {
    $stmt = $pdo->query("SELECT * FROM `profesionales` ORDER BY `room_number` ASC, `name` ASC");
    $rows = $stmt->fetchAll();

    $dentists = [];
    foreach ($rows as $r) {
        $dentists[] = [
            'id' => $r['id'],
            'name' => $r['name'],
            'licenseNumber' => $r['license_number'] ?: '',
            'specialty' => $r['specialty'],
            'roomNumber' => (int)$r['room_number'],
            'phone' => $r['phone'] ?: '',
            'email' => $r['email'] ?: '',
            'active' => (bool)$r['active']
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($dentists),
        "dentists" => $dentists
    ], JSON_UNESCAPED_UNICODE);
}

function handlePost($pdo) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || empty($data['name'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Nombre del profesional es obligatorio."]);
        return;
    }

    $id = !empty($data['id']) ? $data['id'] : ('doc-' . round(microtime(true) * 1000));
    $name = trim($data['name']);
    $license = isset($data['licenseNumber']) ? trim($data['licenseNumber']) : '';
    $specialty = !empty($data['specialty']) ? trim($data['specialty']) : 'Medicina General';
    $room = isset($data['roomNumber']) ? (int)$data['roomNumber'] : 1;
    $phone = isset($data['phone']) ? trim($data['phone']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $active = isset($data['active']) ? ($data['active'] ? 1 : 0) : 1;

    $sql = "INSERT INTO `profesionales` (
        `id`, `name`, `license_number`, `specialty`, `room_number`, `phone`, `email`, `active`
    ) VALUES (
        :id, :name, :lic, :spec, :room, :phone, :email, :active
    ) ON DUPLICATE KEY UPDATE
        `name` = VALUES(`name`),
        `license_number` = VALUES(`license_number`),
        `specialty` = VALUES(`specialty`),
        `room_number` = VALUES(`room_number`),
        `phone` = VALUES(`phone`),
        `email` = VALUES(`email`),
        `active` = VALUES(`active`)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'lic' => $license,
        'spec' => $specialty,
        'room' => $room,
        'phone' => $phone,
        'email' => $email,
        'active' => $active
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Profesional médico guardado exitosamente en MySQL.",
        "id" => $id
    ], JSON_UNESCAPED_UNICODE);
}

function handleDelete($pdo) {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de profesional requerido"]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM `profesionales` WHERE `id` = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(["success" => true, "message" => "Profesional médico eliminado de la base de datos."]);
}
