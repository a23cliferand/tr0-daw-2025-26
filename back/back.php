<?php
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Obtenim l'acció desitjada des de la query string 
$action = $_GET['action'] ?? null;

$functionsDir = __DIR__ . "/functions/";

$ALLOWED_ACTIONS = [
    "conexio",
    "correccio",
    "crearPregunta",
    "editarPregunta",
    "esborrarPregunta",
    "getData"
];

if ($action && in_array($action, $ALLOWED_ACTIONS)) {
    require $functionsDir . $action . ".php";
} else {
    http_response_code(404);
    echo json_encode(["error" => "Funcion no encontrada"]);
}
?>