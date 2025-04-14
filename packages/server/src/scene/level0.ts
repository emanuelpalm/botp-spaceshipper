import { ServerPortal } from "../entity/server-portal.ts";
import { ServerPlayer } from "../entity/server-player.ts";
import { Scene } from "./scene.ts";
import { DataBackgroundStars, DataBackgroundType, DataEntityType, PaletteId } from "@spaceshipper/common";

const background: DataBackgroundStars = {
  type: DataBackgroundType.Stars,

  width: 960,
  height: 540,

  starCount: 100,

  dx: -2,
  dy: 3,
};

// Create players
const players = [
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
      opacity: 1,
      radius: 80,
    }),

    // Players
    ...players.map((player, index) => new ServerPlayer({
      id: `player-${index}`,
      type: DataEntityType.Player,
      x: Math.random() * 960,
      y: Math.random() * 540,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
      paletteId: player.paletteId,
      name: player.name,
      score: 0,
      opacity: 1,
    })),
  ]
);
