<?php
// MySQL connection details
$host = 'localhost';  // Your host
$dbname = 'melanoma';  // Your database name
$username = 'debian-sys-maint';  // Replace with your MySQL username
$password = 'S1sMF9txb8Ed3MQR';  // Replace with your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['numero_identificador'])) {
        $numero_identificador = $input['numero_identificador'];
        $estat = $input['estat'];
        $pregunta1 = $input['pregunta1'];
        $pregunta2 = $input['pregunta2'];
        $pregunta3 = $input['pregunta3'];
        $user = $input['user'];

        // Prepare the SQL update query
        $sql = "UPDATE papers 
                SET estat = :estat, pregunta1 = :pregunta1, pregunta2 = :pregunta2, pregunta3 = :pregunta3, user = :user 
                WHERE numero_identificador = :numero_identificador";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':estat', $estat);
        if (is_null($pregunta1)) {
            $stmt->bindParam(':pregunta1', $pregunta1, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':pregunta1', $pregunta1, PDO::PARAM_INT); // Use PDO::PARAM_INT for 1 or 0
        }
        if (is_null($pregunta2)) {
            $stmt->bindParam(':pregunta2', $pregunta2, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':pregunta2', $pregunta2, PDO::PARAM_INT); // Use PDO::PARAM_INT for 1 or 0
        }
        if (is_null($pregunta3)) {
            $stmt->bindParam(':pregunta3', $pregunta3, PDO::PARAM_NULL);
        } else {
            $stmt->bindParam(':pregunta3', $pregunta3, PDO::PARAM_INT); // Use PDO::PARAM_INT for 1 or 0
        }
        $stmt->bindParam(':numero_identificador', $numero_identificador);
        $stmt->bindParam(':user', $user);
        
        

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error']);
        }
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
