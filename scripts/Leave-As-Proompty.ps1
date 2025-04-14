# Define the URI and headers
$uri = "http://localhost:3001/players/prompty-1234567890/leave"

# Send the DELETE request
$response = Invoke-WebRequest -Uri $uri -Method DELETE

# Output the response
$response.Content
