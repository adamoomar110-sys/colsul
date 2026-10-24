<?php
// ============================================================
// MIGRACIÓN Y VERIFICACIÓN MYSQL - COLSUL POLICONSULTORIO
// Base de datos en Ferozo: a0170001_colsul
// Startup Aura por Omar Horacio Adamo
// ============================================================

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();

$tables = [
    "registros" => "CREATE TABLE IF NOT EXISTS `registros` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `nombre` VARCHAR(255) NOT NULL,
        `celular` VARCHAR(50) NOT NULL,
        `usuario` VARCHAR(100) DEFAULT NULL,
        `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "pacientes" => "CREATE TABLE IF NOT EXISTS `pacientes` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `dni` VARCHAR(50) NOT NULL,
        `age` INT DEFAULT 30,
        `phone` VARCHAR(50) DEFAULT NULL,
        `email` VARCHAR(255) DEFAULT NULL,
        `photo_url` LONGTEXT DEFAULT NULL,
        `health_insurance` VARCHAR(150) DEFAULT 'Particular',
        `insurance_number` VARCHAR(100) DEFAULT NULL,
        `medical_history` TEXT DEFAULT NULL,
        `allergies` TEXT DEFAULT NULL,
        `health_declaration` LONGTEXT DEFAULT NULL,
        `odontogram_findings` LONGTEXT DEFAULT NULL,
        `specialties_data` LONGTEXT DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_dni` (`dni`),
        INDEX `idx_name` (`name`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "turnos" => "CREATE TABLE IF NOT EXISTS `turnos` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `patient_id` VARCHAR(64) DEFAULT NULL,
        `patient_name` VARCHAR(255) NOT NULL,
        `patient_phone` VARCHAR(50) DEFAULT NULL,
        `dentist_name` VARCHAR(255) NOT NULL,
        `date` DATE NOT NULL,
        `time` VARCHAR(10) NOT NULL,
        `specialty` VARCHAR(120) NOT NULL,
        `room_number` INT DEFAULT 1,
        `status` VARCHAR(50) DEFAULT 'confirmado',
        `origin` VARCHAR(50) DEFAULT 'consultorio',
        `payment_status` VARCHAR(50) DEFAULT 'pendiente',
        `dni` VARCHAR(50) DEFAULT NULL,
        `notes` TEXT DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date` (`date`),
        INDEX `idx_specialty` (`specialty`),
        INDEX `idx_room` (`room_number`),
        INDEX `idx_patient_id` (`patient_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "estudios" => "CREATE TABLE IF NOT EXISTS `estudios` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `patient_id` VARCHAR(64) NOT NULL,
        `date` DATE NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `type` VARCHAR(80) DEFAULT 'general',
        `image_url` LONGTEXT NOT NULL,
        `notes` TEXT DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_estudio_patient` (`patient_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "evoluciones" => "CREATE TABLE IF NOT EXISTS `evoluciones` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `patient_id` VARCHAR(64) NOT NULL,
        `date` DATE NOT NULL,
        `dentist_name` VARCHAR(255) NOT NULL,
        `specialty` VARCHAR(120) DEFAULT NULL,
        `tooth_number` INT DEFAULT NULL,
        `treatment` TEXT NOT NULL,
        `notes` TEXT DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_evo_patient` (`patient_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "presupuestos" => "CREATE TABLE IF NOT EXISTS `presupuestos` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `patient_id` VARCHAR(64) NOT NULL,
        `patient_name` VARCHAR(255) NOT NULL,
        `date` DATE NOT NULL,
        `items` LONGTEXT NOT NULL,
        `total_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        `paid_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
        `status` VARCHAR(50) DEFAULT 'borrador',
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_presupuesto_patient` (`patient_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "profesionales" => "CREATE TABLE IF NOT EXISTS `profesionales` (
        `id` VARCHAR(64) NOT NULL PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `license_number` VARCHAR(100) DEFAULT NULL,
        `specialty` VARCHAR(120) NOT NULL,
        `room_number` INT DEFAULT 1,
        `phone` VARCHAR(50) DEFAULT NULL,
        `email` VARCHAR(255) DEFAULT NULL,
        `active` TINYINT(1) DEFAULT 1,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

$results = [];

foreach ($tables as $name => $sql) {
    try {
        $pdo->exec($sql);
        $count = $pdo->query("SELECT COUNT(*) FROM `{$name}`")->fetchColumn();
        $results[$name] = [
            "status" => "OK",
            "records" => (int)$count
        ];
    } catch (PDOException $e) {
        $results[$name] = [
            "status" => "ERROR",
            "message" => $e->getMessage()
        ];
    }
}

// Auto-seed de profesionales si la tabla está vacía
try {
    $profCount = $pdo->query("SELECT COUNT(*) FROM `profesionales`")->fetchColumn();
    if ((int)$profCount === 0) {
        $initialDoctors = [
            ['id' => 'doc-1', 'name' => 'Dra. Amalia Merlo', 'license_number' => 'MN 42000', 'specialty' => 'Odontología Integral', 'room_number' => 1, 'phone' => '+54 9 11 4589-1234', 'email' => 'odontologia@colsul.com'],
            ['id' => 'doc-2', 'name' => 'Dr. Lucas Varela', 'license_number' => 'MN 42314', 'specialty' => 'Oftalmología', 'room_number' => 2, 'phone' => '+54 9 11 4589-1234', 'email' => 'oftalmologia@colsul.com'],
            ['id' => 'doc-3', 'name' => 'Dra. Mariana Benítez', 'license_number' => 'MN 42628', 'specialty' => 'Cardiología', 'room_number' => 3, 'phone' => '+54 9 11 4589-1234', 'email' => 'cardiologia@colsul.com'],
            ['id' => 'doc-4', 'name' => 'Dr. Diego Morales', 'license_number' => 'MN 42942', 'specialty' => 'Pediatría', 'room_number' => 4, 'phone' => '+54 9 11 4589-1234', 'email' => 'pediatria@colsul.com'],
            ['id' => 'doc-5', 'name' => 'Dr. Esteban Carrizo', 'license_number' => 'MN 43256', 'specialty' => 'Traumatología & Ortopedia', 'room_number' => 5, 'phone' => '+54 9 11 4589-1234', 'email' => 'traumatologia@colsul.com'],
            ['id' => 'doc-6', 'name' => 'Dra. Sofía Roldán', 'license_number' => 'MN 43570', 'specialty' => 'Dermatología', 'room_number' => 6, 'phone' => '+54 9 11 4589-1234', 'email' => 'dermatologia@colsul.com'],
            ['id' => 'doc-7', 'name' => 'Dra. Patricia Gómez', 'license_number' => 'MN 43884', 'specialty' => 'Ginecología & Obstetricia', 'room_number' => 7, 'phone' => '+54 9 11 4589-1234', 'email' => 'ginecologia@colsul.com'],
            ['id' => 'doc-8', 'name' => 'Dr. Guillermo Navarro', 'license_number' => 'MN 44198', 'specialty' => 'Clínica Médica / Medicina Interna', 'room_number' => 8, 'phone' => '+54 9 11 4589-1234', 'email' => 'clinica_medica@colsul.com'],
            ['id' => 'doc-9', 'name' => 'Lic. Camila Méndez', 'license_number' => 'MN 44512', 'specialty' => 'Nutrición & Dietética', 'room_number' => 9, 'phone' => '+54 9 11 4589-1234', 'email' => 'nutricion@colsul.com'],
            ['id' => 'doc-10', 'name' => 'Lic. Lautaro Silva', 'license_number' => 'MN 44826', 'specialty' => 'Kinesiología & Fisioterapia', 'room_number' => 10, 'phone' => '+54 9 11 4589-1234', 'email' => 'kinesiologia@colsul.com'],
            ['id' => 'doc-11', 'name' => 'Dr. Marcelo Font', 'license_number' => 'MN 45140', 'specialty' => 'Otorrinolaringología (ORL)', 'room_number' => 2, 'phone' => '+54 9 11 4589-1234', 'email' => 'otorrinolaringologia@colsul.com'],
            ['id' => 'doc-12', 'name' => 'Dr. Andrés Casares', 'license_number' => 'MN 45454', 'specialty' => 'Neumonología', 'room_number' => 3, 'phone' => '+54 9 11 4589-1234', 'email' => 'neumonologia@colsul.com'],
            ['id' => 'doc-13', 'name' => 'Dra. Gabriela Suárez', 'license_number' => 'MN 45768', 'specialty' => 'Neurología', 'room_number' => 5, 'phone' => '+54 9 11 4589-1234', 'email' => 'neurologia@colsul.com'],
            ['id' => 'doc-14', 'name' => 'Lic. Martina Paz', 'license_number' => 'MN 46082', 'specialty' => 'Psicología & Salud Mental', 'room_number' => 8, 'phone' => '+54 9 11 4589-1234', 'email' => 'psicologia@colsul.com'],
            ['id' => 'doc-15', 'name' => 'Dr. Roberto Blanco', 'license_number' => 'MN 46396', 'specialty' => 'Urología', 'room_number' => 7, 'phone' => '+54 9 11 4589-1234', 'email' => 'urologia@colsul.com']
        ];

        $ins = $pdo->prepare("INSERT INTO `profesionales` (`id`, `name`, `license_number`, `specialty`, `room_number`, `phone`, `email`, `active`) VALUES (?, ?, ?, ?, ?, ?, ?, 1)");
        foreach ($initialDoctors as $d) {
            $ins->execute([$d['id'], $d['name'], $d['license_number'], $d['specialty'], $d['room_number'], $d['phone'], $d['email']]);
        }
        $results['profesionales']['records'] = count($initialDoctors);
        $results['profesionales']['seeded'] = true;
    }
} catch (PDOException $e) {
    // Silently continue if error
}

echo json_encode([
    "success" => true,
    "message" => "Tablas verificadas correctamente en la base de datos a0170001_colsul en Ferozo.",
    "database" => "a0170001_colsul",
    "startup" => "Aura por Omar Horacio Adamo",
    "timestamp" => date('Y-m-d H:i:s'),
    "tables" => $results
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
