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

echo json_encode([
    "success" => true,
    "message" => "Tablas verificadas correctamente en la base de datos a0170001_colsul en Ferozo.",
    "database" => "a0170001_colsul",
    "startup" => "Aura por Omar Horacio Adamo",
    "timestamp" => date('Y-m-d H:i:s'),
    "tables" => $results
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
