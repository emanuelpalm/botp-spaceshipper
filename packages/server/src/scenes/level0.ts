import { Scene } from "../scene.js";
import { EntityType, DataPortal, DataSpaceship } from "@spaceshipper/common";
;

// Create spaceships
const ships = [
  { name: "Alpha", primary: "#e20de5", secondary: "#29c1e3", tint: "#7b6aeb" },
  { name: "Beta", primary: "#f2d609", secondary: "#7ece6f", tint: "#0fc0d2" },
  { name: "Gamma", primary: "#bde2f5", secondary: "#f599e4", tint: "#d6bbee" },
  { name: "Delta", primary: "#18f9f1", secondary: "#b685ff", tint: "#91b9fe" },
  { name: "Epsilon", primary: "#fd0983", secondary: "#3e1a7a", tint: "#9c0d79" },
  { name: "Iota", primary: "#f5d863", secondary: "#92149c", tint: "#f13b63" },
  { name: "Kappa", primary: "#31ec9f", secondary: "#06a5f6", tint: "#19ccc8" }
];

export const level0: Scene = {
  entities: [
    // Target portal
    {
      id: "portal",
      type: EntityType.Portal,
      x: 100,
      y: 100,
      dx: 0,
      dy: 0,
      primaryColor: "#06f667",
      secondaryColor: "#06f6b6",
      tintColor: "#72f7a8",
      name: "TARGET",
      radius: 80,
    } as DataPortal,

    // Spaceships
    ...ships.map((ship, index) => ({
      id: `ship-${index}`,
      type: EntityType.Spaceship,
      x: Math.random() * 960,
      y: Math.random() * 540,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
      primaryColor: ship.primary,
      secondaryColor: ship.secondary,
      tintColor: ship.tint,
      name: ship.name,
    } as DataSpaceship)),
  ]
};

