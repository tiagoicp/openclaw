//#region extensions/perplexity/src/perplexity-web-search-provider.shared.ts
const DEFAULT_PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1";
const PERPLEXITY_DIRECT_BASE_URL = "https://api.perplexity.ai";
const PERPLEXITY_KEY_PREFIXES = ["pplx-"];
const OPENROUTER_KEY_PREFIXES = ["sk-or-"];
function trimToUndefined(value) {
	return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function normalizeLowercaseStringOrEmpty(value) {
	return trimToUndefined(value)?.toLowerCase() ?? "";
}
function inferPerplexityBaseUrlFromApiKey(apiKey) {
	if (!apiKey) return;
	const normalized = normalizeLowercaseStringOrEmpty(apiKey);
	if (PERPLEXITY_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "direct";
	if (OPENROUTER_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "openrouter";
}
function isDirectPerplexityBaseUrl(baseUrl) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(baseUrl.trim()).hostname) === "api.perplexity.ai";
	} catch {
		return false;
	}
}
function resolvePerplexityRuntimeTransport(params) {
	const perplexity = params.searchConfig?.perplexity;
	const scoped = perplexity && typeof perplexity === "object" && !Array.isArray(perplexity) ? perplexity : void 0;
	const configuredBaseUrl = trimToUndefined(scoped?.baseUrl) ?? "";
	const configuredModel = trimToUndefined(scoped?.model) ?? "";
	const baseUrl = (() => {
		if (configuredBaseUrl) return configuredBaseUrl;
		if (params.keySource === "env") {
			if (params.fallbackEnvVar === "PERPLEXITY_API_KEY") return PERPLEXITY_DIRECT_BASE_URL;
			if (params.fallbackEnvVar === "OPENROUTER_API_KEY") return DEFAULT_PERPLEXITY_BASE_URL;
		}
		if ((params.keySource === "config" || params.keySource === "secretRef") && params.resolvedKey) return inferPerplexityBaseUrlFromApiKey(params.resolvedKey) === "openrouter" ? DEFAULT_PERPLEXITY_BASE_URL : PERPLEXITY_DIRECT_BASE_URL;
		return DEFAULT_PERPLEXITY_BASE_URL;
	})();
	return configuredBaseUrl || configuredModel || !isDirectPerplexityBaseUrl(baseUrl) ? "chat_completions" : "search_api";
}
//#endregion
export { resolvePerplexityRuntimeTransport as a, isDirectPerplexityBaseUrl as i, PERPLEXITY_DIRECT_BASE_URL as n, inferPerplexityBaseUrlFromApiKey as r, DEFAULT_PERPLEXITY_BASE_URL as t };
