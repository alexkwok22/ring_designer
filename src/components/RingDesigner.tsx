"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { DesignConfig, DEFAULT_CONFIG, MapBounds } from "@/types/design";
import { configToParams, paramsToConfig } from "@/lib/urlParams";
import DesignPanel from "./DesignPanel";
import RingPreview from "./RingPreview";

// Leaflet must be loaded client-side only
const MapSelector = dynamic(() => import("./MapSelector"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm animate-pulse">
      Loading map…
    </div>
  ),
});

type Tab = "preview" | "map";

export default function RingDesigner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<DesignConfig>(() =>
    paramsToConfig(searchParams)
  );
  const [activeTab, setActiveTab] = useState<Tab>("preview");

  // Sync URL whenever config changes
  useEffect(() => {
    const params = configToParams(config);
    router.replace(`/design?${params.toString()}`, { scroll: false });
  }, [config, router]);

  const handleChange = useCallback((patch: Partial<DesignConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleBoundsChange = useCallback((bounds: MapBounds, bearing: number) => {
    setConfig((prev) => ({ ...prev, mapBounds: bounds, bearing }));
  }, []);

  const handleReset = () => setConfig(DEFAULT_CONFIG);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] overflow-hidden">
      {/* ── Left sidebar: customization controls ── */}
      <aside className="w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950 overflow-y-auto">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Customise</h2>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
          >
            Reset
          </button>
        </div>
        <DesignPanel config={config} onChange={handleChange} />
      </aside>

      {/* ── Main area: preview + map tabs ── */}
      <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          {(["preview", "map"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-gray-900 text-gray-900 dark:border-white dark:text-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          {/* Copy-link button */}
          <div className="ml-auto flex items-center pr-4">
            <button
              onClick={() => {
                const url = `${window.location.origin}/design?${configToParams(config).toString()}`;
                navigator.clipboard.writeText(url).catch(() => {});
              }}
              className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-400 transition-colors"
              title="Copy link to this design"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-auto">
          {/* Keep both panels mounted to avoid re-initializing Leaflet on every tab switch */}
          <div className={activeTab === "preview" ? "block" : "hidden"}>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-8 gap-8">
              <RingPreview config={config} />

              {/* Design summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg w-full text-center">
                {[
                  ["Style", config.style],
                  ["Weight", config.weight],
                  ["Shape", config.shape],
                  ["Profile", config.profile],
                  ["Material", config.material === "RoseGold" ? "Rose Gold" : config.material],
                  ["Stone Band", config.stoneBand],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3"
                  >
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map bounds info */}
              <div className="max-w-lg w-full rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                <div className="font-sans font-semibold text-gray-700 dark:text-gray-300 mb-1 text-xs">
                  Engraving Area
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span>N: {config.mapBounds.north.toFixed(4)}°</span>
                  <span>E: {config.mapBounds.east.toFixed(4)}°</span>
                  <span>S: {config.mapBounds.south.toFixed(4)}°</span>
                  <span>W: {config.mapBounds.west.toFixed(4)}°</span>
                </div>
                <div className="mt-1">Bearing: {config.bearing.toFixed(1)}°</div>
              </div>
            </div>
          </div>

          <div className={activeTab === "map" ? "block" : "hidden"}>
            <div className="p-4 lg:p-6 max-w-2xl mx-auto w-full">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Select Engraving Area
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pan and zoom the map below to choose the geographic area that will be engraved on your ring.
                </p>
              </div>
              <MapSelector
                bounds={config.mapBounds}
                bearing={config.bearing}
                onBoundsChange={handleBoundsChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
