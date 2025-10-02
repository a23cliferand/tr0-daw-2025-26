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
    !isset($data['pregunta'], $data['resposta_correcta']) ||
    !!empty($resposta1) || empty($resposta2) || empty($resposta3) || empty($resposta4) || !$image
) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Missing required fields',
        'data' => $data,
        'image' => $image
    ]);
    exit;
}

// Pujar la imatge
$uploadDir = __DIR__ . '/../../img/';

// Guardar la imatge amb un nom temporal
$uploadFile = $uploadDir . basename($image['name']);
if (!move_uploaded_file($image['tmp_name'], $uploadFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to upload image']);
    exit;
}

$imageName = basename($image['name']);

try {
    // Inserir la pregunta a la base de dades
    $stmt = $conn->prepare("INSERT INTO preguntes (pregunta, resposta1, resposta2, resposta3, resposta4, resposta_correcta, imatge) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssis",
        $data['pregunta'],
        $resposta1,
        $resposta2,
        $resposta3,
        $resposta4,
        $data['resposta_correcta'],
        $imageName
    );

    // Actualitzar el nom de la imatge després d'obtenir l'ID
    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $newImageName = $newId . '.png';
        $newImagePath = $uploadDir . $newImageName;

        if (rename($uploadFile, $newImagePath)) {
            // Update the database with the new image name
            $updateStmt = $conn->prepare("UPDATE preguntes SET imatge = ? WHERE id = ?");
            $updateStmt->bind_param("si", $newImageName, $newId);

            if ($updateStmt->execute()) {
                echo json_encode(['success' => true, 'id' => $newId]);
            } else {
                throw new Exception('Failed to update image name in database: ' . $updateStmt->error);
            }

            $updateStmt->close();
        } else {
            throw new Exception('Failed to rename image file');
        }
    } else {
        throw new Exception('Failed to insert question: ' . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conexion->close();
}
?>