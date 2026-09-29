<?php
// ============================================================
// API PACIENTES - COLSUL POLICONSULTORIO
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
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $dni = isset($_GET['dni']) ? trim($_GET['dni']) : null;

    if ($id || $dni) {
        $sql = "SELECT * FROM `pacientes` WHERE " . ($id ? "`id` = :val" : "`dni` = :val") . " LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['val' => $id ?: $dni]);
        $p = $stmt->fetch();

        if (!$p) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Paciente no encontrado"]);
            return;
        }

        // Obtener estudios asociados
        $stmtEstudios = $pdo->prepare("SELECT * FROM `estudios` WHERE `patient_id` = :pid ORDER BY `date` DESC");
        $stmtEstudios->execute(['pid' => $p['id']]);
        $estudios = $stmtEstudios->fetchAll();

        // Obtener evoluciones asociadas
        $stmtEvo = $pdo->prepare("SELECT * FROM `evoluciones` WHERE `patient_id` = :pid ORDER BY `date` DESC");
        $stmtEvo->execute(['pid' => $p['id']]);
        $evoluciones = $stmtEvo->fetchAll();

        echo json_encode([
            "success" => true,
            "patient" => formatPatientRow($p, $estudios, $evoluciones)
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    // Listar todos los pacientes
    $stmt = $pdo->query("SELECT * FROM `pacientes` ORDER BY `name` ASC");
    $rows = $stmt->fetchAll();

    // Obtener todos los estudios y evoluciones en lote para eficiencia
    $allEstudios = $pdo->query("SELECT * FROM `estudios` ORDER BY `date` DESC")->fetchAll();
    $allEvoluciones = $pdo->query("SELECT * FROM `evoluciones` ORDER BY `date` DESC")->fetchAll();

    $estudiosByPatient = [];
    foreach ($allEstudios as $e) {
        $estudiosByPatient[$e['patient_id']][] = [
            'id' => $e['id'],
            'date' => $e['date'],
            'title' => $e['title'],
            'type' => $e['type'],
            'imageUrl' => $e['image_url'],
            'notes' => $e['notes']
        ];
    }

    $evolucionesByPatient = [];
    foreach ($allEvoluciones as $evo) {
        $evolucionesByPatient[$evo['patient_id']][] = [
            'id' => $evo['id'],
            'date' => $evo['date'],
            'dentistName' => $evo['dentist_name'],
            'toothNumber' => $evo['tooth_number'] ? (int)$evo['tooth_number'] : null,
            'treatment' => $evo['treatment'],
            'notes' => $evo['notes']
        ];
    }

    $patients = [];
    foreach ($rows as $row) {
        $pid = $row['id'];
        $est = isset($estudiosByPatient[$pid]) ? $estudiosByPatient[$pid] : [];
        $ev = isset($evolucionesByPatient[$pid]) ? $evolucionesByPatient[$pid] : [];
        $patients[] = formatPatientRow($row, $est, $ev);
    }

    echo json_encode([
        "success" => true,
        "count" => count($patients),
        "patients" => $patients
    ], JSON_UNESCAPED_UNICODE);
}

function handlePost($pdo) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data || !isset($data['name']) || !isset($data['dni'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Datos incompletos. Nombre y DNI son obligatorios."]);
        return;
    }

    $id = !empty($data['id']) ? $data['id'] : ('p-' . round(microtime(true) * 1000));
    $name = trim($data['name']);
    $dni = trim($data['dni']);
    $age = isset($data['age']) ? (int)$data['age'] : 30;
    $phone = isset($data['phone']) ? trim($data['phone']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $photoUrl = isset($data['photoUrl']) ? $data['photoUrl'] : null;
    $healthInsurance = isset($data['healthInsurance']) ? trim($data['healthInsurance']) : 'Particular';
    $insuranceNumber = isset($data['insuranceNumber']) ? trim($data['insuranceNumber']) : '';
    $medicalHistory = isset($data['medicalHistory']) ? trim($data['medicalHistory']) : '';
    $allergies = isset($data['allergies']) ? trim($data['allergies']) : '';
    $notes = isset($data['notes']) ? trim($data['notes']) : '';

    $healthDeclaration = isset($data['healthDeclaration']) ? json_encode($data['healthDeclaration'], JSON_UNESCAPED_UNICODE) : null;
    $odontogramFindings = isset($data['odontogramFindings']) ? json_encode($data['odontogramFindings'], JSON_UNESCAPED_UNICODE) : '[]';
    $specialtiesData = isset($data['specialtiesData']) ? json_encode($data['specialtiesData'], JSON_UNESCAPED_UNICODE) : '{}';

    $sql = "INSERT INTO `pacientes` (
        `id`, `name`, `dni`, `age`, `phone`, `email`, `photo_url`,
        `health_insurance`, `insurance_number`, `medical_history`, `allergies`,
        `health_declaration`, `odontogram_findings`, `specialties_data`, `notes`
    ) VALUES (
        :id, :name, :dni, :age, :phone, :email, :photo_url,
        :health_insurance, :insurance_number, :medical_history, :allergies,
        :health_declaration, :odontogram_findings, :specialties_data, :notes
    ) ON DUPLICATE KEY UPDATE
        `name` = VALUES(`name`),
        `dni` = VALUES(`dni`),
        `age` = VALUES(`age`),
        `phone` = VALUES(`phone`),
        `email` = VALUES(`email`),
        `photo_url` = VALUES(`photo_url`),
        `health_insurance` = VALUES(`health_insurance`),
        `insurance_number` = VALUES(`insurance_number`),
        `medical_history` = VALUES(`medical_history`),
        `allergies` = VALUES(`allergies`),
        `health_declaration` = VALUES(`health_declaration`),
        `odontogram_findings` = VALUES(`odontogram_findings`),
        `specialties_data` = VALUES(`specialties_data`),
        `notes` = VALUES(`notes`),
        `updated_at` = NOW()";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'dni' => $dni,
        'age' => $age,
        'phone' => $phone,
        'email' => $email,
        'photo_url' => $photoUrl,
        'health_insurance' => $healthInsurance,
        'insurance_number' => $insuranceNumber,
        'medical_history' => $medicalHistory,
        'allergies' => $allergies,
        'health_declaration' => $healthDeclaration,
        'odontogram_findings' => $odontogramFindings,
        'specialties_data' => $specialtiesData,
        'notes' => $notes
    ]);

    // Si vienen estudios o evoluciones en el mismo payload, sincronizarlos
    if (!empty($data['xrays']) && is_array($data['xrays'])) {
        foreach ($data['xrays'] as $xr) {
            if (!empty($xr['imageUrl']) && !empty($xr['title'])) {
                $xid = !empty($xr['id']) ? $xr['id'] : ('xray-' . round(microtime(true) * 1000) . '-' . rand(100, 999));
                $stmtX = $pdo->prepare("INSERT INTO `estudios` (`id`, `patient_id`, `date`, `title`, `type`, `image_url`, `notes`)
                    VALUES (:id, :pid, :date, :title, :type, :img, :notes)
                    ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `image_url`=VALUES(`image_url`), `notes`=VALUES(`notes`)");
                $stmtX->execute([
                    'id' => $xid,
                    'pid' => $id,
                    'date' => !empty($xr['date']) ? $xr['date'] : date('Y-m-d'),
                    'title' => $xr['title'],
                    'type' => !empty($xr['type']) ? $xr['type'] : 'general',
                    'img' => $xr['imageUrl'],
                    'notes' => !empty($xr['notes']) ? $xr['notes'] : null
                ]);
            }
        }
    }

    if (!empty($data['evolutions']) && is_array($data['evolutions'])) {
        foreach ($data['evolutions'] as $evo) {
            if (!empty($evo['treatment'])) {
                $eid = !empty($evo['id']) ? $evo['id'] : ('evo-' . round(microtime(true) * 1000) . '-' . rand(100, 999));
                $stmtE = $pdo->prepare("INSERT INTO `evoluciones` (`id`, `patient_id`, `date`, `dentist_name`, `tooth_number`, `treatment`, `notes`)
                    VALUES (:id, :pid, :date, :dentist, :tooth, :treatment, :notes)
                    ON DUPLICATE KEY UPDATE `treatment`=VALUES(`treatment`), `notes`=VALUES(`notes`)");
                $stmtE->execute([
                    'id' => $eid,
                    'pid' => $id,
                    'date' => !empty($evo['date']) ? $evo['date'] : date('Y-m-d'),
                    'dentist' => !empty($evo['dentistName']) ? $evo['dentistName'] : 'Especialista',
                    'tooth' => !empty($evo['toothNumber']) ? (int)$evo['toothNumber'] : null,
                    'treatment' => $evo['treatment'],
                    'notes' => !empty($evo['notes']) ? $evo['notes'] : null
                ]);
            }
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Paciente guardado exitosamente en MySQL.",
        "id" => $id
    ], JSON_UNESCAPED_UNICODE);
}

function handleDelete($pdo) {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID de paciente requerido"]);
        return;
    }

    $stmt = $pdo->prepare("DELETE FROM `pacientes` WHERE `id` = :id");
    $stmt->execute(['id' => $id]);

    // Eliminar estudios y turnos asociados
    $pdo->prepare("DELETE FROM `estudios` WHERE `patient_id` = :id")->execute(['id' => $id]);
    $pdo->prepare("DELETE FROM `evoluciones` WHERE `patient_id` = :id")->execute(['id' => $id]);
    $pdo->prepare("DELETE FROM `turnos` WHERE `patient_id` = :id")->execute(['id' => $id]);

    echo json_encode(["success" => true, "message" => "Paciente eliminado de la base de datos."]);
}

function formatPatientRow($row, $estudios = [], $evoluciones = []) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'dni' => $row['dni'],
        'age' => (int)$row['age'],
        'phone' => $row['phone'] ?: '',
        'email' => $row['email'] ?: '',
        'photoUrl' => $row['photo_url'] ?: '',
        'healthInsurance' => $row['health_insurance'] ?: 'Particular',
        'insuranceNumber' => $row['insurance_number'] ?: '',
        'medicalHistory' => $row['medical_history'] ?: '',
        'allergies' => $row['allergies'] ?: '',
        'healthDeclaration' => $row['health_declaration'] ? json_decode($row['health_declaration'], true) : null,
        'odontogramFindings' => $row['odontogram_findings'] ? json_decode($row['odontogram_findings'], true) : [],
        'specialtiesData' => $row['specialties_data'] ? json_decode($row['specialties_data'], true) : new stdClass(),
        'xrays' => $estudios,
        'evolutions' => $evoluciones,
        'notes' => $row['notes'] ?: ''
    ];
}
