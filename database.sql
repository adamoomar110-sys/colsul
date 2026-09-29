-- =========================================================================
-- ESQUEMA SQL OFICIAL - COLSUL POLICONSULTORIO MÉDICO MULTIESPECIALIDAD
-- Base de Datos: a0170001_colsul
-- Startup Aura por Omar Horacio Adamo
-- =========================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLA DE REGISTROS DE ACCESO
CREATE TABLE IF NOT EXISTS `registros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `celular` VARCHAR(50) NOT NULL,
  `usuario` VARCHAR(100) DEFAULT NULL,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA DE PACIENTES
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `dni` VARCHAR(50) NOT NULL,
  `age` INT DEFAULT 30,
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `health_insurance` VARCHAR(150) DEFAULT 'Particular',
  `insurance_number` VARCHAR(100) DEFAULT NULL,
  `medical_history` TEXT DEFAULT NULL,
  `allergies` TEXT DEFAULT NULL,
  `health_declaration` LONGTEXT DEFAULT NULL COMMENT 'JSON con anamnesis y patologías preexistentes',
  `odontogram_findings` LONGTEXT DEFAULT NULL COMMENT 'JSON con hallazgos odontograma FDI',
  `specialties_data` LONGTEXT DEFAULT NULL COMMENT 'JSON con fichas clínicas de las 15 especialidades',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_dni` (`dni`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA DE TURNOS Y CITAS MÉDICAS
CREATE TABLE IF NOT EXISTS `turnos` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `patient_id` VARCHAR(64) DEFAULT NULL,
  `patient_name` VARCHAR(255) NOT NULL,
  `patient_phone` VARCHAR(50) DEFAULT NULL,
  `dentist_name` VARCHAR(255) NOT NULL COMMENT 'Nombre del médico o profesional asignado',
  `date` DATE NOT NULL,
  `time` VARCHAR(10) NOT NULL,
  `specialty` VARCHAR(120) NOT NULL COMMENT 'Una de las 15 especialidades médicas',
  `room_number` INT DEFAULT 1 COMMENT 'Consultorio físico 1 al 10',
  `status` VARCHAR(50) DEFAULT 'confirmado' COMMENT 'pendiente, confirmado, atendido, cancelado',
  `origin` VARCHAR(50) DEFAULT 'consultorio' COMMENT 'online, consultorio',
  `payment_status` VARCHAR(50) DEFAULT 'pendiente' COMMENT 'pendiente, seña_abonada, total_abonado',
  `dni` VARCHAR(50) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_specialty` (`specialty`),
  INDEX `idx_room` (`room_number`),
  INDEX `idx_patient_id` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA DE ESTUDIOS DIAGNÓSTICOS Y RADIOGRAFÍAS
CREATE TABLE IF NOT EXISTS `estudios` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `patient_id` VARCHAR(64) NOT NULL,
  `date` DATE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(80) DEFAULT 'general' COMMENT 'panoramica, periapical, ecografia, rmn, tac, espirometria, audiometria',
  `image_url` LONGTEXT NOT NULL COMMENT 'URL o archivo base64 del estudio',
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_estudio_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA DE EVOLUCIÓN CLÍNICA DIARIA
CREATE TABLE IF NOT EXISTS `evoluciones` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABLA DE PRESUPUESTOS Y FACTURACIÓN
CREATE TABLE IF NOT EXISTS `presupuestos` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `patient_id` VARCHAR(64) NOT NULL,
  `patient_name` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `items` LONGTEXT NOT NULL COMMENT 'JSON con detalle de prestaciones y costos',
  `total_cost` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `paid_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'borrador' COMMENT 'borrador, aprobado, en_proceso, completado',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_presupuesto_patient` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABLA DE PROFESIONALES Y MÉDICOS
CREATE TABLE IF NOT EXISTS `profesionales` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `license_number` VARCHAR(100) DEFAULT NULL,
  `specialty` VARCHAR(120) NOT NULL,
  `room_number` INT DEFAULT 1,
  `phone` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
