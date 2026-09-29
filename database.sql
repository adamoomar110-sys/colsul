-- Script SQL para crear la tabla de registros en DonWeb para Odonto Merlo
-- Ejecutar este script desde phpMyAdmin en la base de datos exclusiva de Odonto Merlo

CREATE TABLE IF NOT EXISTS `registros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(255) NOT NULL,
  `celular` VARCHAR(50) NOT NULL,
  `usuario` VARCHAR(100) DEFAULT NULL,
  `fecha_registro` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
