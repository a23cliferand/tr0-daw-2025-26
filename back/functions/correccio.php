<?php
require_once 'conexio.php';

$respostes = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    //Conexio
    $conexio = new Conexio();
    $conn = $conexio->getConnection();

    $respostesCorrectes = 0;
    $detallRespostesCorrectes = [];

    // Query per cada resposta del usuari
    foreach ($respostes as $resposta) {
        $idPregunta = (int) $resposta['p'];
        $respostaUsuari = (int) $resposta['r'];

        $stmt = $conn->prepare("SELECT resposta_correcta FROM preguntes WHERE id = ?");
        $stmt->bind_param("i", $idPregunta);
        $stmt->execute();
        $result = $stmt->get_result();

        // Comprovar si la resposta és correcta
        if ($row = $result->fetch_assoc()) {
            $respostaCorrecta = (int) $row['resposta_correcta'];
            if ($respostaCorrecta === $respostaUsuari) {
                $respostesCorrectes++;
            }
            $detallRespostesCorrectes[] = [
                'id' => $idPregunta,
                'correcta' => $respostaCorrecta
            ];
        }
        $stmt->close();
    }

    $conexio->close();
    $totalPreguntes = count($respostes);
    // Retornem el resultat en format JSON
    // detallRespostesCorrectes: [{ "id": x, "correcta": 2}, ...]
    echo json_encode([
        'respostesCorrectes' => $respostesCorrectes,
        'totalPreguntes' => $totalPreguntes,
        'detallRespostesCorrectes' => $detallRespostesCorrectes
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>