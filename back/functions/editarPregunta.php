<?php
require_once 'conexio.php';
$conexion = new Conexio();
$conn = $conexion->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['respostes']) && is_array($data['respostes'])) {
    $resposta1 = $data['respostes'][0]['etiqueta'] ?? '';
    $resposta2 = $data['respostes'][1]['etiqueta'] ?? '';
    $resposta3 = $data['respostes'][2]['etiqueta'] ?? '';
    $resposta4 = $data['respostes'][3]['etiqueta'] ?? '';
} else {
    $resposta1 = $data['resposta1'] ?? '';
    $resposta2 = $data['resposta2'] ?? '';
    $resposta3 = $data['resposta3'] ?? '';
    $resposta4 = $data['resposta4'] ?? '';
}

if (!isset($data['id'], $data['pregunta'], $data['resposta_correcta'], $data['imatge']) || 
    empty($resposta1) || empty($resposta2) || empty($resposta3) || empty($resposta4)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE preguntes SET pregunta = ?, resposta1 = ?, resposta2 = ?, resposta3 = ?, resposta4 = ?, resposta_correcta = ?, imatge = ? WHERE id = ?");
    $stmt->bind_param(
        "sssssisi",
        $data['pregunta'],
        $resposta1,
        $resposta2,
        $resposta3,
        $resposta4,
        $data['resposta_correcta'],
        $data['imatge'],
        $data['id']
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Failed to update question: ' . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conexion->close();
}