<?php
require_once 'conexio.php';
$conexion = new Conexio();
$conn = $conexion->getConnection();

$data = $_POST;
$image = $_FILES['imatge'] ?? null;

// Suport per a respostes en format array o com a camps individuals
$respostes = isset($data['respostes']) ? json_decode($data['respostes'], true) : [];
if (is_array($respostes)) {
    $resposta1 = $respostes[0]['etiqueta'] ?? '';
    $resposta2 = $respostes[1]['etiqueta'] ?? '';
    $resposta3 = $respostes[2]['etiqueta'] ?? '';
    $resposta4 = $respostes[3]['etiqueta'] ?? '';
} else {
    $resposta1 = $data['resposta1'] ?? '';
    $resposta2 = $data['resposta2'] ?? '';
    $resposta3 = $data['resposta3'] ?? '';
    $resposta4 = $data['resposta4'] ?? '';
}

// Validació bàsica
if (
    !isset($data['id']) || !isset($data['pregunta']) || !isset($data['resposta_correcta']) ||
    empty($resposta1) || empty($resposta2) || empty($resposta3) || empty($resposta4)
) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'data' => $data,
        'image' => $image
    ]);
    exit;
}

// Pujar la imatge si s'ha proporcionat una nova
$uploadFile = null;
if ($image) {
    $uploadDir = __DIR__ . '/../../img/';

    $stmt = $conn->prepare("SELECT imatge FROM preguntes WHERE id = ?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $currentImage = $result->fetch_assoc()['imatge'] ?? null;
    $stmt->close();

    if ($currentImage && file_exists($uploadDir . $currentImage)) {
        unlink($uploadDir . $currentImage);
    }

    $newImageName = $data['id'] . '.png';
    $uploadFile = $uploadDir . $newImageName;
    if (!move_uploaded_file($image['tmp_name'], $uploadFile)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload image']);
        exit;
    }
}

try {
    // Actualitzar la pregunta a la base de dades
    $query = "UPDATE preguntes SET pregunta = ?, resposta1 = ?, resposta2 = ?, resposta3 = ?, resposta4 = ?, resposta_correcta = ?";
    $params = [
        $data['pregunta'],
        $resposta1,
        $resposta2,
        $resposta3,
        $resposta4,
        $data['resposta_correcta']
    ];
    $types = "sssssi";

    if ($uploadFile) {
        $query .= ", imatge = ?";
        $params[] = $newImageName;
        $types .= "s";
    }

    // Afegir la condició WHERE a la query
    $query .= " WHERE id = ?";
    $params[] = $data['id'];
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

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
?>