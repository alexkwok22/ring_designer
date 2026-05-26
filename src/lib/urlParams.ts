import {
  DesignConfig,
  DEFAULT_CONFIG,
  MaterialName,
  RingStyle,
  RingWeight,
  RingShape,
  RingProfile,
  StoneBand,
  SizeMeasurement,
} from "@/types/design";

export function configToParams(config: DesignConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set("style", config.style);
  params.set("weight", config.weight);
  params.set("shape", config.shape);
  params.set("profile", config.profile);
  params.set("sb", config.stoneBand);
  params.set("sz", String(config.size));
  params.set("sm", config.sizeMeasurement);
  params.set("mn", config.material);
  params.set("fh", String(config.faceHeight));
  params.set("n", String(config.mapBounds.north));
  params.set("e", String(config.mapBounds.east));
  params.set("s", String(config.mapBounds.south));
  params.set("w", String(config.mapBounds.west));
  params.set("bearing", String(config.bearing));
  return params;
}

export function paramsToConfig(params: URLSearchParams): DesignConfig {
  const validStyles: RingStyle[] = ["plate", "band", "signet"];
  const validWeights: RingWeight[] = ["subtle", "light", "medium", "heavy"];
  const validShapes: RingShape[] = ["portrait", "landscape", "square"];
  const validProfiles: RingProfile[] = ["flat", "rounded", "comfort"];
  const validStoneBands: StoneBand[] = ["none", "subtle", "prominent"];
  const validSizeMeasurements: SizeMeasurement[] = ["us", "eu", "uk"];
  const validMaterials: MaterialName[] = ["Silver", "Gold", "RoseGold", "Platinum"];

  const style = params.get("style") as RingStyle;
  const weight = params.get("weight") as RingWeight;
  const shape = params.get("shape") as RingShape;
  const profile = params.get("profile") as RingProfile;
  const stoneBand = params.get("sb") as StoneBand;
  const sizeMeasurement = params.get("sm") as SizeMeasurement;
  const material = params.get("mn") as MaterialName;

  return {
    style: validStyles.includes(style) ? style : DEFAULT_CONFIG.style,
    weight: validWeights.includes(weight) ? weight : DEFAULT_CONFIG.weight,
    shape: validShapes.includes(shape) ? shape : DEFAULT_CONFIG.shape,
    profile: validProfiles.includes(profile) ? profile : DEFAULT_CONFIG.profile,
    stoneBand: validStoneBands.includes(stoneBand) ? stoneBand : DEFAULT_CONFIG.stoneBand,
    size: Number(params.get("sz") ?? DEFAULT_CONFIG.size),
    sizeMeasurement: validSizeMeasurements.includes(sizeMeasurement)
      ? sizeMeasurement
      : DEFAULT_CONFIG.sizeMeasurement,
    material: validMaterials.includes(material) ? material : DEFAULT_CONFIG.material,
    faceHeight: Number(params.get("fh") ?? DEFAULT_CONFIG.faceHeight),
    mapBounds: {
      north: Number(params.get("n") ?? DEFAULT_CONFIG.mapBounds.north),
      east: Number(params.get("e") ?? DEFAULT_CONFIG.mapBounds.east),
      south: Number(params.get("s") ?? DEFAULT_CONFIG.mapBounds.south),
      west: Number(params.get("w") ?? DEFAULT_CONFIG.mapBounds.west),
    },
    bearing: Number(params.get("bearing") ?? DEFAULT_CONFIG.bearing),
  };
}
