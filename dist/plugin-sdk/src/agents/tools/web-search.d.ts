import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeWebSearchMetadata } from "../../secrets/runtime-web-tools.types.js";
import type { AnyAgentTool } from "./common.js";
export declare function createWebSearchTool(options?: {
    config?: OpenClawConfig;
    sandboxed?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
}): AnyAgentTool | null;
export declare const __testing: {
    resolveSearchConfig: (cfg?: OpenClawConfig) => {
        enabled?: boolean;
        provider?: string;
        maxResults?: number;
        timeoutSeconds?: number;
        cacheTtlMinutes?: number;
        apiKey?: import("../../config/types.secrets.ts").SecretInput;
        brave?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
        firecrawl?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
        gemini?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
        grok?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
        kimi?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
        perplexity?: {
            apiKey?: import("../../config/types.secrets.ts").SecretInput;
            baseUrl?: string;
            model?: string;
            mode?: string;
            inlineCitations?: boolean;
        };
    } | undefined;
    resolveSearchProvider: typeof import("../../web-search/runtime.js").resolveWebSearchProviderId;
    resolveWebSearchProviderId: typeof import("../../web-search/runtime.js").resolveWebSearchProviderId;
    SEARCH_CACHE: Map<string, import("./web-shared.ts").CacheEntry<Record<string, unknown>>>;
};
