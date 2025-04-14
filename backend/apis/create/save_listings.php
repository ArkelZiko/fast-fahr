<?php

include __DIR__ . '/../../config/Connect.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// THis is to deal with CORS (this will allow the POST request to go through)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST requests are allowed.']);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

// ERROR CHECKING
if (!$input) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

// All the parameters we are working with towards the listings
$requiredFields = [
    'title',
    'make',
    'model',
    'year',
    'price',
    'mileage',
    'description',
    'transmission',
    'fuelType',
    'driveType',
    'bodyType',
    'exteriorColor',
    'province',
    'city',
];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || $input[$field] === '') {
        http_response_code(400);
        echo json_encode(['error' => "Missing or empty field: $field"]);
        exit;
    }
}

try {
    $stmt = $dbh->prepare("
        INSERT INTO posts (
        title, make, model, year, price, mileage,
        description, transmission, fuelType, 
        driveType, bodyType, exteriorColor, province,
        city)
        VALUES 
        (:title, :make, :model, :year, :price, :mileage,
        :description, :transmission, :fuelType, 
        :driveType, :bodyType, :exteriorColor, :province,
        :city)
    ");

    $stmt->execute([
        ':title' => $input['title'],
        ':make' => $input['make'],
        ':model' => $input['model'],
        ':year' => (int) $input['year'],
        ':price' => (float) $input['price'],
        ':mileage' => (int) str_replace(',', '', $input['mileage']),
        ':description' => $input['description'],
        ':transmission' => $input['transmission'],
        ':fuelType' => $input['fuelType'],
        ':driveType' => $input['driveType'],
        ':bodyType' => $input['bodyType'],
        ':exteriorColor' => $input['exteriorColor'],
        ':province' => $input['province'],
        ':city' => $input['city'],
    ]);

    echo json_encode(['success' => true, 'message' => 'Listing saved successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
