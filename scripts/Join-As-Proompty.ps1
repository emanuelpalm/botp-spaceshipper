# Define the JSON body as a hashtable
$body = @{
  "name" = "Proompty"
  "id"   = "prompty-1234567890"
} | ConvertTo-Json

# Define the URI and headers
$uri = "http://localhost:3001/players/join"
$headers = @{
  "Content-Type" = "application/json"
}

# Send the POST request
$response = Invoke-WebRequest -Uri $uri -Method POST -Body $body -Headers $headers

# Output the response
$response.Content
