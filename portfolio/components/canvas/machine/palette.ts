/**
 * Shared colour + material presets for the Machine Room. Metals sit at
 * metalness 0.8 so they read almost entirely through the procedural
 * environment map and the amber / titanium-blue point lights.
 */
export const PALETTE = {
  void: "#050505",
  titanium: "#8d949c",
  silver: "#b9bec4",
  graphite: "#1c1e21",
  steel: "#3b4046",
  amber: "#ff9a3c",
  amberHot: "#ffc27a",
  blue: "#5c8fd6",
  blueSoft: "#9fbde6",
} as const;

export const METAL = {
  titanium: { color: PALETTE.titanium, metalness: 0.8, roughness: 0.28 },
  brushed: { color: PALETTE.silver, metalness: 0.8, roughness: 0.42 },
  graphite: { color: PALETTE.graphite, metalness: 0.8, roughness: 0.62 },
  steel: { color: PALETTE.steel, metalness: 0.8, roughness: 0.5 },
} as const;
