import type { OpenClawConfig } from "./config.js";
export declare function listLegacyWebSearchConfigPaths(raw: unknown): string[];
export declare function normalizeLegacyWebSearchConfig<T>(raw: T): T;
export declare function resolvePluginWebSearchConfig(config: OpenClawConfig | undefined, pluginId: string): Record<string, unknown> | undefined;
