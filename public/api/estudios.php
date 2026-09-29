<?php
// ============================================================
// API ESTUDIOS DIAGNÓSTICOS - COLSUL POLICONSULTORIO
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
    $patientId = isset($_GET['patientId']) ? trim($_GET['patientId']) : null;
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM `estudios` WHERE `id` = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Estudio no encontrado"]);
            return;
        }
        echo json_encode(["success" => true, "estudio" => formatEstudioRow($row)], JSON_UNESCAPED_UNICODE);
        return;
    }

    if ($patientId) {
        $stmt = $pdo->prepare("SELECT * FROM `estudios` WHERE `patient_id` = :pid ORDER BY `date` DESC, `created_at` DESC");
        $stmt->execute(['pid' => $patientId]);
        $rows = $stmt->fetchAll();
    } else {
        $stmt = $pdo->query("SELECT * FROM `estudios` ORDER BY `date` DESC, `created_at` DESC LIMIT 100");
        $rows = $stmt->fetchAll();
    }

    $estudios = array_map('formatEstudioRow', $rows);
    echo json_encode(["success" => true, "count" => count($estudios), "estudios" => $estudios], JSON_UNESCAPED_UNICODE);
}

function handlePost($pdo) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || !isset($data['patientId']) || !isset($data['imageUrl']) || !isset($data['title'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos incompletos. ID de paciente, título e imagen son obligatorios."]);
        return;
    }

    $id = !empty($data['id']) ? $data['id'] : ('xray-' . round(microtime(true) * 1000));
    $patientId = trim($data['patientId']);
    $date = !empty($data['date']) ? trim($data['date']) : date('Y-m-d');
    $title = trim($data['title']);
    $type = !empty($data['type']) ? trim($data['type']) : 'general';
    $imageUrl = trim($data['imageUrl']);
    $notes = isset($data['notes']) ? trim($data['notes']) : '';

    $sql = "INSERT INTO `estudios` (`id`, `patient_id`, `date`, `title`, `type`, `image_url`, `notes`)
            VALUES (:id, :pid, :date, :title, :type, :img, :notes)
            ON DUPLICATE KEY UPDATE
            `patient_id` = VALUES(`patient_id`),
            `date` = VALUES(`date`),
            `title` = VALUES(`title`),
            `type` = VALUES(`type`),
            `image_url` = VALUES(`image_url`),
            `notes` = VALUES(`notes`)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $id,
        'pid' => $patientId,
        'date' => $date,
        'title' => $title,
        'type' => $type,
        'img' => $imageUrl,
        'notes' => $notes
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Estudio registrado exitosamente en MySQL.",
        "id" => $id
    ], JSON_UNESCAPED_UNICODE);
}

function handleDelete($pdo) {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de estudio requerido"]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM `estudios` WHERE `id` = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(["success" => true, "message" => "Estudio eliminado de la base de datos."]);
}

function formatEstudioRow($r) {
    return [
        'id' => $r['id'],
        'patientId' => $r['patient_id'],
        'date' => $r['date'],
        'title' => $r['title'],
        'type' => $r['type'],
        'imageUrl' => $r['image_url'],
        'notes' => $r['notes'] ?: ''
    ];
}
