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

        // Prepare the SQL update query
        $sql = "UPDATE papers 
                SET estat = :estat, pregunta1 = :pregunta1, pregunta2 = :pregunta2 
                WHERE numero_identificador = :numero_identificador";
                
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':estat', $estat);
        $stmt->bindParam(':pregunta1', $pregunta1, PDO::PARAM_BOOL);
        $stmt->bindParam(':pregunta2', $pregunta2, PDO::PARAM_BOOL);
        $stmt->bindParam(':numero_identificador', $numero_identificador);
        
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
