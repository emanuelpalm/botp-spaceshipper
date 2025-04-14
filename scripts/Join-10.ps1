# Define a list of players with space-themed names
$players = @( 
    @{ name = "StarDust"; id = "player-stardust-12345678" }
    @{ name = "CosmicRay"; id = "player-cosmic-ray-12345" }
    @{ name = "NebulaNinja"; id = "player-nebula-ninja-123" }
    @{ name = "GalaxyGlider"; id = "player-galaxy-glide-12" }
    @{ name = "AstroAce"; id = "player-astro-ace-12345" }
    @{ name = "VortexViper"; id = "player-vortex-viper-12" }
    @{ name = "QuasarQueen"; id = "player-quasar-queen-12" }
    @{ name = "PulsarPilot"; id = "player-pulsar-pilot-12" }
    @{ name = "MeteorMaster"; id = "player-meteor-master-12" }
    @{ name = "NovaKnight"; id = "player-nova-knight-123" }
)

# Define headers
$headers = @{
    "Content-Type" = "application/json"
}

# URI for the join endpoint
$uri = "http://localhost:3001/players/join"

# Join with each player
foreach ($player in $players) {
    Write-Host "Joining as $($player.name)..."
    
    # Convert player data to JSON
    $body = $player | ConvertTo-Json
    
    try {
        # Send the POST request
        $response = Invoke-WebRequest -Uri $uri -Method POST -Body $body -Headers $headers
        
        # Output the response
        Write-Host "Response: $($response.Content)"
        Write-Host ""
        
        # Small delay between joins
        Start-Sleep -Milliseconds 100
    }
    catch {
        Write-Host "Failed to join with $($player.name): $_"
    }
}
