import { ServerPortal } from "../entity/server-portal.ts";
import { ServerSpaceship } from "../entity/server-spaceship.ts";
import { Scene } from "../scene.js";
import { DataEntityType, getPalette, PaletteId } from "@spaceshipper/common";

// Create spaceships
const ships = [
  { name: "Alpha", palette: PaletteId.PlayerAlpha },
  { name: "Beta", palette: PaletteId.PlayerBeta },
  { name: "Gamma", palette: PaletteId.PlayerGamma },
  { name: "Delta", palette: PaletteId.PlayerDelta },
  { name: "Epsilon", palette: PaletteId.PlayerEpsilon },
  { name: "Iota", palette: PaletteId.PlayerIota },
  { name: "Kappa", palette: PaletteId.PlayerKappa },
];

export const level0 = new Scene([
  // Target portal
  new ServerPortal({
    id: "portal",
    type: DataEntityType.Portal,
    x: 100,
    y: 100,
    dx: 0,
    dy: 0,
    palette: getPalette(PaletteId.Target),
    name: "TARGET",
    radius: 80,
  }),

  // Spaceships
  ...ships.map((ship, index) => new ServerSpaceship({
    id: `ship-${index}`,
    type: DataEntityType.Spaceship,
    x: Math.random() * 960,
    y: Math.random() * 540,
    dx: (Math.random() - 0.5) * 200,
    dy: (Math.random() - 0.5) * 200,
    palette: getPalette(ship.palette),
    name: ship.name,
  })),
]);
