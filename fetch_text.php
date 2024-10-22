<?php
// MySQL connection details
$host = 'localhost';  // Your host
$dbname = 'melanoma';  // Your database name
$username = 'debian-sys-maint';  // Replace with your MySQL username
$password = 'S1sMF9txb8Ed3MQR';  // Replace with your MySQL password

try {
    // Connect to the database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to get a random row from the 'papers' table
    $query = "SELECT * FROM papers ORDER BY RAND() LIMIT 1"; // Replace 'papers' with your table name if needed
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
