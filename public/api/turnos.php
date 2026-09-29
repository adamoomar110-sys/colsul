<?php
// ============================================================
// API TURNOS - COLSUL POLICONSULTORIO
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
    $date = isset($_GET['date']) ? trim($_GET['date']) : null;
    $specialty = isset($_GET['specialty']) ? trim($_GET['specialty']) : null;
    $patientId = isset($_GET['patientId']) ? trim($_GET['patientId']) : null;

    $query = "SELECT * FROM `turnos` WHERE 1=1";
    $params = [];

    if ($date) {
        $query .= " AND `date` = :date";
        $params['date'] = $date;
    }
    if ($specialty) {
        $query .= " AND `specialty` = :specialty";
        $params['specialty'] = $specialty;
    }
    if ($patientId) {
        $query .= " AND `patient_id` = :patient_id";
        $params['patient_id'] = $patientId;
    }

    $query .= " ORDER BY `date` DESC, `time` ASC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $appointments = [];
    foreach ($rows as $r) {
        $appointments[] = [
            'id' => $r['id'],
            'patientId' => $r['patient_id'] ?: '',
            'patientName' => $r['patient_name'],
            'patientPhone' => $r['patient_phone'] ?: '',
            'dentistName' => $r['dentist_name'],
            'date' => $r['date'],
            'time' => $r['time'],
            'specialty' => $r['specialty'],
            'roomNumber' => $r['room_number'] ? (int)$r['room_number'] : 1,
            'status' => $r['status'] ?: 'confirmado',
            'origin' => $r['origin'] ?: 'consultorio',
            'paymentStatus' => $r['payment_status'] ?: 'pendiente',
            'dni' => $r['dni'] ?: '',
            'notes' => $r['notes'] ?: ''
        ];
    }

    echo json_encode([
        "success" => true,
        "count" => count($appointments),
        "appointments" => $appointments
    ], JSON_UNESCAPED_UNICODE);
}

function handlePost($pdo) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || !isset($data['patientName']) || !isset($data['date']) || !isset($data['time'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos incompletos. Paciente, fecha y hora son obligatorios."]);
        return;
    }

    $id = !empty($data['id']) ? $data['id'] : ('app-' . round(microtime(true) * 1000));
    $patientId = !empty($data['patientId']) ? $data['patientId'] : null;
    $patientName = trim($data['patientName']);
    $patientPhone = isset($data['patientPhone']) ? trim($data['patientPhone']) : null;
    $dentistName = isset($data['dentistName']) ? trim($data['dentistName']) : 'Especialista General';
    $date = trim($data['date']);
    $time = trim($data['time']);
    $specialty = isset($data['specialty']) ? trim($data['specialty']) : 'odontologia';
    $roomNumber = isset($data['roomNumber']) ? (int)$data['roomNumber'] : 1;
    $status = isset($data['status']) ? trim($data['status']) : 'confirmado';
    $origin = isset($data['origin']) ? trim($data['origin']) : 'consultorio';
    $paymentStatus = isset($data['paymentStatus']) ? trim($data['paymentStatus']) : 'pendiente';
    $dni = isset($data['dni']) ? trim($data['dni']) : null;
    $notes = isset($data['notes']) ? trim($data['notes']) : '';

    $sql = "INSERT INTO `turnos` (
        `id`, `patient_id`, `patient_name`, `patient_phone`, `dentist_name`,
        `date`, `time`, `specialty`, `room_number`, `status`,
        `origin`, `payment_status`, `dni`, `notes`
    ) VALUES (
        :id, :patient_id, :patient_name, :patient_phone, :dentist_name,
        :date, :time, :specialty, :room_number, :status,
        :origin, :payment_status, :dni, :notes
    ) ON DUPLICATE KEY UPDATE
        `patient_id` = VALUES(`patient_id`),
        `patient_name` = VALUES(`patient_name`),
        `patient_phone` = VALUES(`patient_phone`),
        `dentist_name` = VALUES(`dentist_name`),
        `date` = VALUES(`date`),
        `time` = VALUES(`time`),
        `specialty` = VALUES(`specialty`),
        `room_number` = VALUES(`room_number`),
        `status` = VALUES(`status`),
        `origin` = VALUES(`origin`),
        `payment_status` = VALUES(`payment_status`),
        `dni` = VALUES(`dni`),
        `notes` = VALUES(`notes`),
        `updated_at` = NOW()";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $id,
        'patient_id' => $patientId,
        'patient_name' => $patientName,
        'patient_phone' => $patientPhone,
        'dentist_name' => $dentistName,
        'date' => $date,
        'time' => $time,
        'specialty' => $specialty,
        'room_number' => $roomNumber,
        'status' => $status,
        'origin' => $origin,
        'payment_status' => $paymentStatus,
        'dni' => $dni,
        'notes' => $notes
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Turno registrado exitosamente en MySQL.",
        "id" => $id
    ], JSON_UNESCAPED_UNICODE);
}

function handleDelete($pdo) {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de turno requerido"]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM `turnos` WHERE `id` = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(["success" => true, "message" => "Turno eliminado de la base de datos."]);
}
