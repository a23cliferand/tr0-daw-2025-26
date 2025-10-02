<?php
require_once 'conexio.php';
$conexion = new Conexio();
$conn = $conexion->getConnection();

$quantitat = isset($_GET['quantitat']) ? $_GET['quantitat'] : 1;

try {
    $result = $conn->query("SELECT * FROM preguntes");

    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }

    $preguntes = $result->fetch_all(MYSQLI_ASSOC);

    // Formatejar les preguntes amb les respostes en un array per adaptar-les al json original
    $preguntesFormatted = [];
    foreach ($preguntes as $pregunta) {
        $preguntaFormatted = [
            'id' => $pregunta['id'],
            'pregunta' => $pregunta['pregunta'],
            'respostes' => [
                ['id' => 1, 'etiqueta' => $pregunta['resposta1']],
                ['id' => 2, 'etiqueta' => $pregunta['resposta2']],
                ['id' => 3, 'etiqueta' => $pregunta['resposta3']],
                ['id' => 4, 'etiqueta' => $pregunta['resposta4']]
            ],
            'resposta_correcta' => $pregunta['resposta_correcta'],
            'imatge' => $pregunta['imatge']
        ];
        $preguntesFormatted[] = $preguntaFormatted;
    }

    // Si es demanen totes les preguntes, no cal filtrar ni desar a sessió
    if ($quantitat == "all") {
        echo json_encode(["preguntes" => $preguntesFormatted], JSON_UNESCAPED_UNICODE);
    }
    // Si es demana una quantitat específica, seleccionar aleatòriament
    else {
        $quantitat = intval($quantitat);
        if (count($preguntesFormatted) >= $quantitat) {
            $claus = array_rand($preguntesFormatted, $quantitat);

            $_SESSION['preguntes'] = [];
            if ($quantitat === 1) {
                $_SESSION['preguntes'][] = $preguntesFormatted[$claus];
            } else {
                foreach ($claus as $i) {
                    $_SESSION['preguntes'][] = $preguntesFormatted[$i];
                }
            }

            $preguntesFinal = [];
            foreach ($_SESSION['preguntes'] as $pregunta) {
                unset($pregunta['resposta_correcta']);
                $preguntesFinal[] = $pregunta;
            }

            echo json_encode(["preguntes" => $preguntesFinal], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Not enough questions available']);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conexion->close();
}
?>