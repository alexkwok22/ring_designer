export type RingStyle = "plate" | "band" | "signet";
export type RingWeight = "subtle" | "light" | "medium" | "heavy";
export type RingShape = "portrait" | "landscape" | "square";
export type RingProfile = "flat" | "rounded" | "comfort";
export type StoneBand = "none" | "subtle" | "prominent";
export type SizeMeasurement = "us" | "eu" | "uk";
export type MaterialName = "Silver" | "Gold" | "RoseGold" | "Platinum";

export interface MapBounds {
  north: number;
  east: number;
  south: number;
  west: number;
}

export interface DesignConfig {
  style: RingStyle;
  weight: RingWeight;
  shape: RingShape;
  profile: RingProfile;
  stoneBand: StoneBand;
  size: number;
  sizeMeasurement: SizeMeasurement;
  material: MaterialName;
  faceHeight: number;
  mapBounds: MapBounds;
  bearing: number;
}

export const DEFAULT_CONFIG: DesignConfig = {
  style: "plate",
  weight: "subtle",
  shape: "portrait",
  profile: "flat",
  stoneBand: "subtle",
  size: 0,
  sizeMeasurement: "us",
  material: "Silver",
  faceHeight: 0.62,
  mapBounds: {
    north: 32.868,
    east: 131.091,
    south: 32.82,
    west: 131.033,
  },
  bearing: -143,
};

export const MATERIAL_COLORS: Record<MaterialName, { base: string; highlight: string; shadow: string }> = {
  Silver: { base: "#C0C0C0", highlight: "#E8E8E8", shadow: "#808080" },
  Gold: { base: "#D4AF37", highlight: "#F0D060", shadow: "#8B6914" },
  RoseGold: { base: "#B76E79", highlight: "#D4959E", shadow: "#7B3F4A" },
  Platinum: { base: "#E5E4E2", highlight: "#F5F4F2", shadow: "#A9A9A9" },
};

export const US_SIZES = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
export const EU_SIZES = [44, 46, 48, 49, 50, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 67, 68];
export const UK_SIZES = ["F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"];
