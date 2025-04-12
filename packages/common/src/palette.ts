export interface Palette {
  primary: string;
  secondary: string;
  tint: string;
}

export enum PaletteId {
  PlayerAlpha = 0,
  PlayerBeta = 1,
  PlayerGamma = 2,
  PlayerDelta = 3,
  PlayerEpsilon = 4,
  PlayerIota = 5,
  PlayerKappa = 6,
  Target = 7,
}

export function getPalette(id: PaletteId): Palette {
  switch (id) {
    case PaletteId.PlayerAlpha:
      return { primary: "#e20de5", secondary: "#29c1e3", tint: "#7b6aeb" };

    case PaletteId.PlayerBeta:
      return { primary: "#f2d609", secondary: "#7ece6f", tint: "#0fc0d2" };

    case PaletteId.PlayerGamma:
      return { primary: "#bde2f5", secondary: "#f599e4", tint: "#d6bbee" };

    case PaletteId.PlayerDelta:
      return { primary: "#18f9f1", secondary: "#b685ff", tint: "#91b9fe" };

    case PaletteId.PlayerEpsilon:
      return { primary: "#fd0983", secondary: "#3e1a7a", tint: "#9c0d79" };

    case PaletteId.PlayerIota:
      return { primary: "#f5d863", secondary: "#92149c", tint: "#f13b63" };

    case PaletteId.PlayerKappa:
      return { primary: "#31ec9f", secondary: "#06a5f6", tint: "#19ccc8" };

    case PaletteId.Target:
      return { primary: "#06f667", secondary: "#06f6b6", tint: "#72f7a8" };
  }
}