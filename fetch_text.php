<?php
// MySQL connection details
$host = 'localhost';
$dbname = 'melanoma';
$username = 'debian-sys-maint';
$password = 'S1sMF9txb8Ed3MQR';

try {
    // Connect to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = isset($_GET['id']) ? $_GET['id'] : null;

    if ( !isset($id) ){
        // Query to get a random row from the 'papers' table
        $query = "SELECT * FROM papers WHERE estat NOT IN ('busy','tagged') ORDER BY RAND() LIMIT 1";
    }else{
        // Query to get a random row from the 'papers' table
        $query = "SELECT * FROM papers WHERE numero_identificador = $id";
    }

    $stmt = $pdo->query($query);
    if ($stmt) {
        // Fetch the random row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($row) {
            // Prepare the response array
            $response = [
                'identificador_numeric' => $row['numero_identificador'], // Adjust this to your actual column name
                'text' => $row['text'] // Replace 'text' with the actual column name for the long text
            ];

            // Output the response as JSON
            echo json_encode($response);
        } else {
            echo json_encode(['error' => 'No data found.']);
        }
    } else {
        echo json_encode(['error' => 'Query failed.']);
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
