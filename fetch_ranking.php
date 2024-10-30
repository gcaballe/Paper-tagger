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

    $query = "SELECT 
    COUNT(p.numero_identificador) AS paper_count, 
    user,
    SUM(CASE WHEN DATE(p.last_updated) = CURDATE() THEN 1 ELSE 0 END) AS today_paper_count
FROM 
    papers p
WHERE 
    estat != 'pending'
GROUP BY 
    user
ORDER BY 
    today_paper_count DESC;";

    $stmt = $pdo->query($query);
    if ($stmt) {
        // Fetch the random row
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($rows) {
            // Output the result as JSON
            echo json_encode($rows);
        } else {
            echo json_encode(['error' => 'No data found.']);
        }
    } else {
        echo json_encode(['error' => 'Query failed.']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => "Error: " . $e->getMessage()]);
}
?>