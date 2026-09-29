<?php
// ============================================================
// API SINCRONIZACIÓN INTEGRAL - COLSUL POLICONSULTORIO
// Sincroniza pacientes, turnos, estudios y presupuestos con MySQL Ferozo
// Startup Aura por Omar Horacio Adamo
// ============================================================

require_once __DIR__ . '/config.php';
$pdo = getDBConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // 1. OBTENER PACIENTES CON SUS ESTUDIOS Y EVOLUCIONES
    $stmtP = $pdo->query("SELECT * FROM `pacientes` ORDER BY `name` ASC");
    $rawPatients = $stmtP->fetchAll();

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
    foreach ($rawPatients as $row) {
        $pid = $row['id'];
        $patients[] = [
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
            'xrays' => isset($estudiosByPatient[$pid]) ? $estudiosByPatient[$pid] : [],
            'evolutions' => isset($evolucionesByPatient[$pid]) ? $evolucionesByPatient[$pid] : [],
            'notes' => $row['notes'] ?: ''
        ];
    }

    // 2. OBTENER TURNOS
    $stmtT = $pdo->query("SELECT * FROM `turnos` ORDER BY `date` DESC, `time` ASC");
    $rawTurnos = $stmtT->fetchAll();
    $appointments = [];
    foreach ($rawTurnos as $r) {
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

    // 3. OBTENER PRESUPUESTOS
    $stmtB = $pdo->query("SELECT * FROM `presupuestos` ORDER BY `date` DESC");
    $rawBudgets = $stmtB->fetchAll();
    $budgets = [];
    foreach ($rawBudgets as $b) {
        $budgets[] = [
            'id' => $b['id'],
            'patientId' => $b['patient_id'],
            'patientName' => $b['patient_name'],
            'date' => $b['date'],
            'items' => $b['items'] ? json_decode($b['items'], true) : [],
            'totalCost' => (float)$b['total_cost'],
            'paidAmount' => (float)$b['paid_amount'],
            'status' => $b['status'] ?: 'borrador'
        ];
    }

    echo json_encode([
        "success" => true,
        "database" => "a0170001_colsul",
        "counts" => [
            "pacientes" => count($patients),
            "turnos" => count($appointments),
            "presupuestos" => count($budgets)
        ],
        "patients" => $patients,
        "appointments" => $appointments,
        "budgets" => $budgets
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Cuerpo de solicitud inválido."]);
        exit();
    }

    $patientsSaved = 0;
    $appointmentsSaved = 0;
    $budgetsSaved = 0;

    // 1. Guardar pacientes
    if (!empty($data['patients']) && is_array($data['patients'])) {
        $sqlP = "INSERT INTO `pacientes` (
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

        $stmtP = $pdo->prepare($sqlP);

        foreach ($data['patients'] as $p) {
            if (empty($p['name']) || empty($p['dni'])) continue;
            $pid = !empty($p['id']) ? $p['id'] : ('p-' . round(microtime(true) * 1000) . '-' . rand(100, 999));

            $stmtP->execute([
                'id' => $pid,
                'name' => trim($p['name']),
                'dni' => trim($p['dni']),
                'age' => isset($p['age']) ? (int)$p['age'] : 30,
                'phone' => isset($p['phone']) ? trim($p['phone']) : '',
                'email' => isset($p['email']) ? trim($p['email']) : '',
                'photo_url' => isset($p['photoUrl']) ? $p['photoUrl'] : null,
                'health_insurance' => isset($p['healthInsurance']) ? trim($p['healthInsurance']) : 'Particular',
                'insurance_number' => isset($p['insuranceNumber']) ? trim($p['insuranceNumber']) : '',
                'medical_history' => isset($p['medicalHistory']) ? trim($p['medicalHistory']) : '',
                'allergies' => isset($p['allergies']) ? trim($p['allergies']) : '',
                'health_declaration' => isset($p['healthDeclaration']) ? json_encode($p['healthDeclaration'], JSON_UNESCAPED_UNICODE) : null,
                'odontogram_findings' => isset($p['odontogramFindings']) ? json_encode($p['odontogramFindings'], JSON_UNESCAPED_UNICODE) : '[]',
                'specialties_data' => isset($p['specialtiesData']) ? json_encode($p['specialtiesData'], JSON_UNESCAPED_UNICODE) : '{}',
                'notes' => isset($p['notes']) ? trim($p['notes']) : ''
            ]);

            // Guardar estudios si existen
            if (!empty($p['xrays']) && is_array($p['xrays'])) {
                foreach ($p['xrays'] as $xr) {
                    if (!empty($xr['imageUrl']) && !empty($xr['title'])) {
                        $xid = !empty($xr['id']) ? $xr['id'] : ('xray-' . round(microtime(true) * 1000) . '-' . rand(100, 999));
                        $stmtX = $pdo->prepare("INSERT INTO `estudios` (`id`, `patient_id`, `date`, `title`, `type`, `image_url`, `notes`)
                            VALUES (:id, :pid, :date, :title, :type, :img, :notes)
                            ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `image_url`=VALUES(`image_url`), `notes`=VALUES(`notes`)");
                        $stmtX->execute([
                            'id' => $xid,
                            'pid' => $pid,
                            'date' => !empty($xr['date']) ? $xr['date'] : date('Y-m-d'),
                            'title' => $xr['title'],
                            'type' => !empty($xr['type']) ? $xr['type'] : 'general',
                            'img' => $xr['imageUrl'],
                            'notes' => !empty($xr['notes']) ? $xr['notes'] : null
                        ]);
                    }
                }
            }

            // Guardar evoluciones si existen
            if (!empty($p['evolutions']) && is_array($p['evolutions'])) {
                foreach ($p['evolutions'] as $evo) {
                    if (!empty($evo['treatment'])) {
                        $eid = !empty($evo['id']) ? $evo['id'] : ('evo-' . round(microtime(true) * 1000) . '-' . rand(100, 999));
                        $stmtE = $pdo->prepare("INSERT INTO `evoluciones` (`id`, `patient_id`, `date`, `dentist_name`, `tooth_number`, `treatment`, `notes`)
                            VALUES (:id, :pid, :date, :dentist, :tooth, :treatment, :notes)
                            ON DUPLICATE KEY UPDATE `treatment`=VALUES(`treatment`), `notes`=VALUES(`notes`)");
                        $stmtE->execute([
                            'id' => $eid,
                            'pid' => $pid,
                            'date' => !empty($evo['date']) ? $evo['date'] : date('Y-m-d'),
                            'dentist' => !empty($evo['dentistName']) ? $evo['dentistName'] : 'Especialista',
                            'tooth' => !empty($evo['toothNumber']) ? (int)$evo['toothNumber'] : null,
                            'treatment' => $evo['treatment'],
                            'notes' => !empty($evo['notes']) ? $evo['notes'] : null
                        ]);
                    }
                }
            }

            $patientsSaved++;
        }
    }

    // 2. Guardar turnos
    if (!empty($data['appointments']) && is_array($data['appointments'])) {
        $sqlT = "INSERT INTO `turnos` (
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

        $stmtT = $pdo->prepare($sqlT);

        foreach ($data['appointments'] as $app) {
            if (empty($app['patientName']) || empty($app['date']) || empty($app['time'])) continue;
            $aid = !empty($app['id']) ? $app['id'] : ('app-' . round(microtime(true) * 1000) . '-' . rand(100, 999));

            $stmtT->execute([
                'id' => $aid,
                'patient_id' => !empty($app['patientId']) ? $app['patientId'] : null,
                'patient_name' => trim($app['patientName']),
                'patient_phone' => isset($app['patientPhone']) ? trim($app['patientPhone']) : null,
                'dentist_name' => !empty($app['dentistName']) ? trim($app['dentistName']) : 'Especialista General',
                'date' => trim($app['date']),
                'time' => trim($app['time']),
                'specialty' => !empty($app['specialty']) ? trim($app['specialty']) : 'odontologia',
                'room_number' => isset($app['roomNumber']) ? (int)$app['roomNumber'] : 1,
                'status' => !empty($app['status']) ? trim($app['status']) : 'confirmado',
                'origin' => !empty($app['origin']) ? trim($app['origin']) : 'consultorio',
                'payment_status' => !empty($app['paymentStatus']) ? trim($app['paymentStatus']) : 'pendiente',
                'dni' => isset($app['dni']) ? trim($app['dni']) : null,
                'notes' => isset($app['notes']) ? trim($app['notes']) : ''
            ]);
            $appointmentsSaved++;
        }
    }

    // 3. Guardar presupuestos
    if (!empty($data['budgets']) && is_array($data['budgets'])) {
        $sqlB = "INSERT INTO `presupuestos` (
            `id`, `patient_id`, `patient_name`, `date`, `items`, `total_cost`, `paid_amount`, `status`
        ) VALUES (
            :id, :patient_id, :patient_name, :date, :items, :total_cost, :paid_amount, :status
        ) ON DUPLICATE KEY UPDATE
            `patient_id` = VALUES(`patient_id`),
            `patient_name` = VALUES(`patient_name`),
            `date` = VALUES(`date`),
            `items` = VALUES(`items`),
            `total_cost` = VALUES(`total_cost`),
            `paid_amount` = VALUES(`paid_amount`),
            `status` = VALUES(`status`)";

        $stmtB = $pdo->prepare($sqlB);

        foreach ($data['budgets'] as $b) {
            if (empty($b['patientId']) || empty($b['patientName'])) continue;
            $bid = !empty($b['id']) ? $b['id'] : ('bud-' . round(microtime(true) * 1000) . '-' . rand(100, 999));

            $stmtB->execute([
                'id' => $bid,
                'patient_id' => $b['patientId'],
                'patient_name' => trim($b['patientName']),
                'date' => !empty($b['date']) ? $b['date'] : date('Y-m-d'),
                'items' => isset($b['items']) ? json_encode($b['items'], JSON_UNESCAPED_UNICODE) : '[]',
                'total_cost' => isset($b['totalCost']) ? (float)$b['totalCost'] : 0.0,
                'paid_amount' => isset($b['paidAmount']) ? (float)$b['paidAmount'] : 0.0,
                'status' => !empty($b['status']) ? $b['status'] : 'borrador'
            ]);
            $budgetsSaved++;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Sincronización completa con MySQL finalizada con éxito.",
        "saved" => [
            "pacientes" => $patientsSaved,
            "turnos" => $appointmentsSaved,
            "presupuestos" => $budgetsSaved
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Método no permitido"]);
