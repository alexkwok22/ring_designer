"use client";

import { DesignConfig, RingStyle, RingWeight, RingShape, RingProfile, StoneBand, MaterialName, SizeMeasurement, US_SIZES, EU_SIZES, UK_SIZES } from "@/types/design";

interface Props {
  config: DesignConfig;
  onChange: (patch: Partial<DesignConfig>) => void;
}

function OptionButton<T extends string>({
  value,
  current,
  label,
  onClick,
}: {
  value: T;
  current: T;
  label: string;
  onClick: (v: T) => void;
}) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all ${
        active
          ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function DesignPanel({ config, onChange }: Props) {
  const sizeOptions =
    config.sizeMeasurement === "us"
      ? US_SIZES
      : config.sizeMeasurement === "eu"
      ? EU_SIZES
      : UK_SIZES;

  return (
    <div className="flex flex-col gap-5 p-4 overflow-y-auto">
      {/* Style */}
      <Section label="Style">
        {(["plate", "band", "signet"] as RingStyle[]).map((s) => (
          <OptionButton key={s} value={s} current={config.style} label={s.charAt(0).toUpperCase() + s.slice(1)} onClick={(v) => onChange({ style: v })} />
        ))}
      </Section>

      {/* Weight */}
      <Section label="Weight">
        {(["subtle", "light", "medium", "heavy"] as RingWeight[]).map((w) => (
          <OptionButton key={w} value={w} current={config.weight} label={w.charAt(0).toUpperCase() + w.slice(1)} onClick={(v) => onChange({ weight: v })} />
        ))}
      </Section>

      {/* Shape */}
      <Section label="Shape">
        {(["portrait", "landscape", "square"] as RingShape[]).map((s) => (
          <OptionButton key={s} value={s} current={config.shape} label={s.charAt(0).toUpperCase() + s.slice(1)} onClick={(v) => onChange({ shape: v })} />
        ))}
      </Section>

      {/* Profile */}
      <Section label="Profile">
        {(["flat", "rounded", "comfort"] as RingProfile[]).map((p) => (
          <OptionButton key={p} value={p} current={config.profile} label={p.charAt(0).toUpperCase() + p.slice(1)} onClick={(v) => onChange({ profile: v })} />
        ))}
      </Section>

      {/* Stone Band */}
      <Section label="Stone Band">
        {(["none", "subtle", "prominent"] as StoneBand[]).map((s) => (
          <OptionButton key={s} value={s} current={config.stoneBand} label={s.charAt(0).toUpperCase() + s.slice(1)} onClick={(v) => onChange({ stoneBand: v })} />
        ))}
      </Section>

      {/* Material */}
      <Section label="Material">
        {(["Silver", "Gold", "RoseGold", "Platinum"] as MaterialName[]).map((m) => (
          <OptionButton
            key={m}
            value={m}
            current={config.material}
            label={m === "RoseGold" ? "Rose Gold" : m}
            onClick={(v) => onChange({ material: v })}
          />
        ))}
      </Section>

      {/* Size */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Ring Size
        </span>
        <div className="flex items-center gap-2">
          {(["us", "eu", "uk"] as SizeMeasurement[]).map((sm) => (
            <OptionButton key={sm} value={sm} current={config.sizeMeasurement} label={sm.toUpperCase()} onClick={(v) => onChange({ sizeMeasurement: v, size: 0 })} />
          ))}
        </div>
        <select
          value={config.size}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
          className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm"
        >
          <option value={0}>Select size…</option>
          {sizeOptions.map((s, i) => (
            <option key={i} value={i + 1}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Face Height */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Face Height
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {config.faceHeight.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min={0.2}
          max={1}
          step={0.01}
          value={config.faceHeight}
          onChange={(e) => onChange({ faceHeight: parseFloat(e.target.value) })}
          className="w-full accent-gray-800 dark:accent-white"
        />
      </div>
    </div>
  );
}
