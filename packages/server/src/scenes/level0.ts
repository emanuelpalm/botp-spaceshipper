import { ServerPortal } from "../entity/server-portal.ts";
import { ServerSpaceship } from "../entity/server-spaceship.ts";
import { Scene } from "../scene.js";
import { DataBackgroundStars, DataBackgroundType, DataEntityType, PaletteId } from "@spaceshipper/common";

const background: DataBackgroundStars = {
  type: DataBackgroundType.Stars,

  width: 960,
  height: 540,

  starCount: 100,

  dx: -2,
  dy: 3,
};

// Create spaceships
const ships = [
  { name: "Alpha", paletteId: PaletteId.Alpha },
  { name: "Beta", paletteId: PaletteId.Beta },
  { name: "Gamma", paletteId: PaletteId.Gamma },
  { name: "Delta", paletteId: PaletteId.Delta },
  { name: "Epsilon", paletteId: PaletteId.Epsilon },
  { name: "Iota", paletteId: PaletteId.Iota },
  { name: "Kappa", paletteId: PaletteId.Kappa },
];

export const level0 = new Scene(
  "level0",
  background,
  [
    // Target portal
    new ServerPortal({
      id: "portal",
      type: DataEntityType.Portal,
      x: 100,
      y: 100,
      dx: 0,
      dy: 0,
      paletteId: PaletteId.Target,
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
      paletteId: ship.paletteId,
      name: ship.name,
    })),
  ]
);
