<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'email', 'company', 'message'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone'] ?? 'Not provided', ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars($data['company'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$testingType = htmlspecialchars($data['testingType'] ?? 'Not specified', ENT_QUOTES, 'UTF-8');
$sampleQuantity = htmlspecialchars($data['sampleQuantity'] ?? 'Not specified', ENT_QUOTES, 'UTF-8');
$testingTimeline = htmlspecialchars($data['testingTimeline'] ?? 'Not specified', ENT_QUOTES, 'UTF-8');

// Get Resend API key from environment variable
$resendApiKey = getenv('RESEND_API_KEY');
if (!$resendApiKey) {
    error_log('RESEND_API_KEY environment variable not set');
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit();
}

// Prepare email HTML
$emailHtml = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1e3a8a; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #3b82f6; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Testing Services Inquiry</h2>
            <p>Goldfields Testing Laboratory</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Contact Information</div>
                <div class='value'>
                    <strong>Name:</strong> $name<br>
                    <strong>Email:</strong> $email<br>
                    <strong>Phone:</strong> $phone<br>
                    <strong>Company:</strong> $company
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>Testing Requirements</div>
                <div class='value'>
                    <strong>Testing Type:</strong> $testingType<br>
                    <strong>Sample Quantity:</strong> $sampleQuantity<br>
                    <strong>Timeline:</strong> $testingTimeline
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>Project Details</div>
                <div class='value'>$message</div>
            </div>
        </div>
    </div>
</body>
</html>
";

// Prepare Resend API request
$resendData = [
    'from' => 'Goldfields Testing Lab <onboarding@resend.dev>',
    'to' => ['labmanager@gtlab.com.au'],
    'subject' => "New Testing Inquiry from $name - $company",
    'html' => $emailHtml
];

// Send email via Resend API
$ch = curl_init('https://api.resend.com/emails');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($resendData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $resendApiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Check for cURL errors
if ($curlError) {
    error_log("cURL error: $curlError");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
    exit();
}

// Check Resend API response
if ($httpCode !== 200) {
    error_log("Resend API error (HTTP $httpCode): $response");
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
    exit();
}

// Success
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Email sent successfully'
]);
?>
