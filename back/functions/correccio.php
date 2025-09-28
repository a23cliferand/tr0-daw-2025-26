<?php
require_once 'conexio.php';

$respostes = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    $conexio = new Conexio();
    $conn = $conexio->getConnection();

    $respostesCorrectes = 0;

    foreach ($respostes as $resposta) {
        $idPregunta = (int)$resposta['p'];
        $respostaUsuari = (int)$resposta['r'];

        $stmt = $conn->prepare("SELECT resposta_correcta FROM preguntes WHERE id = ?");
        $stmt->bind_param("i", $idPregunta);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            if ((int)$row['resposta_correcta'] === $respostaUsuari) {
                $respostesCorrectes++;
            }
        }
        $stmt->close();
    }

    $conexio->close();
    $totalPreguntes = count($respostes);
    echo json_encode([
        'respostesCorrectes' => $respostesCorrectes,
        'totalPreguntes' => $totalPreguntes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
