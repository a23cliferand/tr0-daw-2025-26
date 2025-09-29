<?php
require_once 'conexio.php';
$conexion = new Conexio();
$conn = $conexion->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

// Verifica que llegue el ID
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing question ID']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT imatge FROM preguntes WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    $stmt->bind_result($imatge);
    $stmt->fetch();
    $stmt->close();

    $image = __DIR__ . "/../../img/{$imatge}";

    if ($imatge && file_exists($image)) {
        (unlink($image));
    }

    $stmt = $conn->prepare("DELETE FROM preguntes WHERE id = ?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Ok']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Pregunta no encontrada']);
        }
    } else {
        throw new Exception('Error: ' . $stmt->error);
    }

    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conexion->close();
}
