<?php
// ============================================================
// CONEXIÓN MYSQL PDO OFICIAL - COLSUL POLICONSULTORIO
// Base de datos en DonWeb: a0170001_colsul
// Startup Aura por Omar Horacio Adamo
// ============================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

date_default_timezone_set('America/Argentina/Buenos_Aires');

$db_host = 'localhost';
$db_name = 'a0170001_colsul';

$credentials = [
    ['user' => 'a0170001_colsul', 'pass' => '@Peloymago110Peloymago110'],
    ['user' => 'a0170001_colsul', 'pass' => 'Colsul2026!'],
    ['user' => 'a0170001_colsul', 'pass' => 'AuraFTP2025@aura'],
    ['user' => 'a0170001',        'pass' => '@Peloymago110Peloymago110'],
    ['user' => 'a0170001',        'pass' => 'AuraFTP2025@aura'],
    ['user' => 'root',            'pass' => '']
];

$pdo = null;
$lastError = '';

foreach ($credentials as $cred) {
    try {
        $testPdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $cred['user'], $cred['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo = $testPdo;
        break;
    } catch (PDOException $e) {
        $lastError = $e->getMessage();
    }
}

function getDBConnection() {
    global $pdo, $lastError;
    if ($pdo) {
        return $pdo;
    }
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "No se pudo conectar a la base de datos MySQL en Ferozo: " . $lastError,
        "hint" => "Verifica que la base de datos a0170001_colsul esté creada en el panel Ferozo."
    ]);
    exit();
}
