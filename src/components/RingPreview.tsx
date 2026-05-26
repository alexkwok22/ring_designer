"use client";

import { useMemo } from "react";
import { DesignConfig, MATERIAL_COLORS } from "@/types/design";

interface Props {
  config: DesignConfig;
  mapImageUrl?: string;
}

export default function RingPreview({ config, mapImageUrl }: Props) {
  const colors = MATERIAL_COLORS[config.material];

  // Derived dimensions based on config
  const dims = useMemo(() => {
    const isPortrait = config.shape === "portrait";
    const isLandscape = config.shape === "landscape";
    const baseW = isLandscape ? 220 : isPortrait ? 140 : 180;
    const baseH = isPortrait ? 220 : isLandscape ? 140 : 180;

    const weightMultiplier =
      config.weight === "subtle" ? 0.8 : config.weight === "light" ? 1 : config.weight === "medium" ? 1.2 : 1.5;

    const bandW = config.style === "band" ? baseW * 1.15 : baseW;
    const bandH = config.style === "band" ? baseH * 1.15 : baseH;

    const outerRx = (config.profile === "flat" ? 8 : config.profile === "rounded" ? 18 : 24) * weightMultiplier;
    const outerRy = outerRx;
    const innerW = bandW - 20 * weightMultiplier;
    const innerH = bandH - 20 * weightMultiplier;
    const innerRx = outerRx * 0.9;

    return {
      svgW: 320,
      svgH: 320,
      cx: 160,
      cy: 160,
      outerW: bandW,
      outerH: bandH,
      innerW: innerW,
      innerH: innerH,
      outerRx,
      outerRy,
      innerRx,
      innerRy: outerRy * 0.9,
      faceH: config.faceHeight,
      weightMultiplier,
    };
  }, [config]);

  const { svgW, svgH, cx, cy, outerW, outerH, innerW, innerH, outerRx, outerRy, innerRx, innerRy } = dims;

  // Signet top plate
  const signetPlateW = outerW * 0.7;
  const signetPlateH = outerH * 0.6;
  const signetPlateTY = cy - outerH / 2 - signetPlateH * 0.15;

  // Stone band notches
  const hasStoneBand = config.stoneBand !== "none";
  const stoneBandSize = config.stoneBand === "prominent" ? 7 : 5;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        aria-label="Ring preview"
        className="drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="metalGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={colors.highlight} />
            <stop offset="50%" stopColor={colors.base} />
            <stop offset="100%" stopColor={colors.shadow} />
          </radialGradient>
          <radialGradient id="innerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.shadow} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.shadow} stopOpacity="0.9" />
          </radialGradient>
          <clipPath id="outerClip">
            <rect
              x={cx - outerW / 2}
              y={cy - outerH / 2}
              width={outerW}
              height={outerH}
              rx={outerRx}
              ry={outerRy}
            />
          </clipPath>
          <clipPath id="mapClip">
            <rect
              x={cx - innerW / 2}
              y={cy - innerH / 2}
              width={innerW}
              height={innerH}
              rx={innerRx}
              ry={innerRy}
            />
          </clipPath>
          {config.style === "signet" && (
            <clipPath id="signetClip">
              <rect
                x={cx - signetPlateW / 2}
                y={signetPlateTY}
                width={signetPlateW}
                height={signetPlateH}
                rx={6}
                ry={6}
              />
            </clipPath>
          )}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={colors.shadow} floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer ring body */}
        <rect
          x={cx - outerW / 2}
          y={cy - outerH / 2}
          width={outerW}
          height={outerH}
          rx={outerRx}
          ry={outerRy}
          fill="url(#metalGrad)"
          stroke={colors.shadow}
          strokeWidth="1"
        />

        {/* Stone band dots */}
        {hasStoneBand && (() => {
          const count = config.stoneBand === "prominent" ? 8 : 5;
          const dots = [];
          for (let i = 0; i < count; i++) {
            const progress = (i + 0.5) / count;
            // distribute along top edge
            const x = cx - outerW / 2 + outerW * progress;
            const y = cy - outerH / 2 + stoneBandSize * 2.2;
            dots.push(
              <circle
                key={`top-${i}`}
                cx={x}
                cy={y}
                r={stoneBandSize}
                fill={colors.highlight}
                stroke={colors.shadow}
                strokeWidth="0.5"
              />,
              <circle
                key={`bot-${i}`}
                cx={x}
                cy={cy + outerH / 2 - stoneBandSize * 2.2}
                r={stoneBandSize}
                fill={colors.highlight}
                stroke={colors.shadow}
                strokeWidth="0.5"
              />
            );
          }
          return dots;
        })()}

        {/* Signet top plate */}
        {config.style === "signet" && (
          <>
            <rect
              x={cx - signetPlateW / 2}
              y={signetPlateTY}
              width={signetPlateW}
              height={signetPlateH}
              rx={6}
              ry={6}
              fill={colors.highlight}
              stroke={colors.base}
              strokeWidth="1.5"
            />
            {mapImageUrl ? (
              <image
                href={mapImageUrl}
                x={cx - signetPlateW / 2 + 4}
                y={signetPlateTY + 4}
                width={signetPlateW - 8}
                height={signetPlateH - 8}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#signetClip)"
                opacity="0.65"
              />
            ) : (
              <text
                x={cx}
                y={signetPlateTY + signetPlateH / 2 + 5}
                textAnchor="middle"
                fill={colors.shadow}
                fontSize="10"
                fontFamily="serif"
                fontStyle="italic"
              >
                Map Engraving
              </text>
            )}
          </>
        )}

        {/* Inner hollow / map face */}
        <rect
          x={cx - innerW / 2}
          y={cy - innerH / 2}
          width={innerW}
          height={innerH}
          rx={innerRx}
          ry={innerRy}
          fill="url(#innerGrad)"
          filter="url(#innerShadow)"
        />

        {/* Map image engraving on the face */}
        {mapImageUrl && config.style !== "signet" && (
          <image
            href={mapImageUrl}
            x={cx - innerW / 2}
            y={cy - innerH / 2}
            width={innerW}
            height={innerH}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#mapClip)"
            opacity="0.55"
            style={{ mixBlendMode: "luminosity" }}
          />
        )}

        {/* Map placeholder text when no map image */}
        {!mapImageUrl && (
          <text
            x={cx}
            y={cy + 5}
            textAnchor="middle"
            fill={colors.highlight}
            fillOpacity="0.5"
            fontSize="11"
            fontFamily="sans-serif"
          >
            Select area on map
          </text>
        )}

        {/* Highlight edge sheen */}
        <rect
          x={cx - outerW / 2 + 2}
          y={cy - outerH / 2 + 2}
          width={outerW * 0.35}
          height={outerH - 4}
          rx={outerRx}
          ry={outerRy}
          fill={colors.highlight}
          opacity="0.18"
          pointerEvents="none"
        />
      </svg>

      {/* Material badge */}
      <div
        className="px-3 py-1 rounded-full text-xs font-medium border"
        style={{
          backgroundColor: colors.base,
          borderColor: colors.shadow,
          color: config.material === "Silver" || config.material === "Platinum" ? "#333" : "#fff",
        }}
      >
        {config.material}
      </div>
    </div>
  );
}
