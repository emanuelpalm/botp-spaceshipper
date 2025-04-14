export interface Palette {
  primary: string;
  secondary: string;
  tint: string;
}

export enum PaletteId {
  Alpha = 0,
  Beta = 1,
  Gamma = 2,
  Delta = 3,
  Epsilon = 4,
  Iota = 5,
  Kappa = 6,

  Target = 7,

  Green = 8,
}

export function getPalette(id: PaletteId): Palette {
  switch (id) {
    case PaletteId.Alpha:
      return { primary: "#e20de5", secondary: "#29c1e3", tint: "#7b6aeb" };

    case PaletteId.Beta:
      return { primary: "#f2d609", secondary: "#7ece6f", tint: "#0fc0d2" };

    case PaletteId.Gamma:
      return { primary: "#bde2f5", secondary: "#f599e4", tint: "#d6bbee" };

    case PaletteId.Delta:
      return { primary: "#18f9f1", secondary: "#b685ff", tint: "#91b9fe" };

    case PaletteId.Epsilon:
      return { primary: "#fd0983", secondary: "#3e1a7a", tint: "#9c0d79" };

    case PaletteId.Iota:
      return { primary: "#f5d863", secondary: "#92149c", tint: "#f13b63" };

    case PaletteId.Kappa:
      return { primary: "#31ec9f", secondary: "#06a5f6", tint: "#19ccc8" };

    case PaletteId.Target:
      return { primary: "#06f667", secondary: "#06f6b6", tint: "#72f7a8" };
    
    case PaletteId.Green:
      return { primary: "#06a5f6", secondary: "#bde2f5", tint: "#9c0d79" };
  }
}

export function getPlayerPaletteId(index: number): PaletteId {
  return index % PaletteId.Kappa + 1;
}