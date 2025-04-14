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

# Leave with each player
foreach ($player in $players) {
    Write-Host "Leaving as $($player.name)..."
    
    try {
        # Send the DELETE request
        $response = Invoke-WebRequest -Uri "http://localhost:3001/players/$($player.id)/leave" -Method DELETE
        
        # Output the response
        Write-Host "Response: $($response.Content)"
        Write-Host ""
        
        # Small delay between joins
        Start-Sleep -Milliseconds 100
    }
    catch {
        Write-Host "Failed to leave with $($player.name): $_"
    }
}
