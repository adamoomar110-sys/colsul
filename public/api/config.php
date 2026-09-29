<?php
// Configuración de Conexión MySQL para DonWeb (Odonto Merlo)
// Modifica estos valores con los datos de la Base de Datos que crees en DonWeb

define('DB_HOST', 'localhost');
define('DB_NAME', 'odonto_merlo_db'); // Nombre de la BD en DonWeb
define('DB_USER', 'odonto_user');     // Usuario de la BD en DonWeb
define('DB_PASS', 'TuPasswordSegura123!'); // Contraseña en DonWeb

function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error de conexión a la base de datos: " . $e->getMessage()
        ]);
        exit;
    }
}
