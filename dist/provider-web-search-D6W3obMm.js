import { c as normalizeResolvedSecretInputString } from "./types.secrets-Es1UJmu9.js";
import { r as resolvePluginWebSearchConfig } from "./legacy-web-search-C4CYOXDT.js";
import { A as withStrictWebToolsEndpoint, N as normalizeSecretInput } from "./plugins-allowlist-CQiNlTMp.js";
//#region src/agents/tools/web-search-citation-redirect.ts
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
	try {
		return await withStrictWebToolsEndpoint({
			url,
			init: { method: "HEAD" },
			timeoutMs: REDIRECT_TIMEOUT_MS
		}, async ({ finalUrl }) => finalUrl || url);
	} catch {
		return url;
	}
}
//#endregion
//#region src/agents/tools/web-search-provider-config.ts
function getTopLevelCredentialValue(searchConfig) {
	return searchConfig?.apiKey;
}
function setTopLevelCredentialValue(searchConfigTarget, value) {
	searchConfigTarget.apiKey = value;
}
function getScopedCredentialValue(searchConfig, key) {
	const scoped = searchConfig?.[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) return;
	return scoped.apiKey;
}
function setScopedCredentialValue(searchConfigTarget, key, value) {
	const scoped = searchConfigTarget[key];
	if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
		searchConfigTarget[key] = { apiKey: value };
		return;
	}
	scoped.apiKey = value;
}
function resolveProviderWebSearchPluginConfig(config, pluginId) {
	return resolvePluginWebSearchConfig(config, pluginId);
}
function ensureObject(target, key) {
	const current = target[key];
	if (current && typeof current === "object" && !Array.isArray(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
function setProviderWebSearchPluginConfigValue(configTarget, pluginId, key, value) {
	const entry = ensureObject(ensureObject(ensureObject(configTarget, "plugins"), "entries"), pluginId);
	if (entry.enabled === void 0) entry.enabled = true;
	const webSearch = ensureObject(ensureObject(entry, "config"), "webSearch");
	webSearch[key] = value;
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
function resolveWebSearchProviderCredential(params) {
	const fromConfig = normalizeSecretInput(normalizeResolvedSecretInputString({
		value: params.credentialValue,
		path: params.path
	}));
	if (fromConfig) return fromConfig;
	for (const envVar of params.envVars) {
		const fromEnv = normalizeSecretInput(process.env[envVar]);
		if (fromEnv) return fromEnv;
	}
}
//#endregion
//#region src/plugin-sdk/provider-web-search.ts
/**
* @deprecated Implement provider-owned `createTool(...)` directly on the
* returned WebSearchProviderPlugin instead of routing through core.
*/
function createPluginBackedWebSearchProvider(provider) {
	return {
		...provider,
		createTool: () => {
			throw new Error(`createPluginBackedWebSearchProvider(${provider.id}) is no longer supported. Define provider-owned createTool(...) directly in the extension's WebSearchProviderPlugin.`);
		}
	};
}
//#endregion
export { resolveProviderWebSearchPluginConfig as a, setTopLevelCredentialValue as c, getTopLevelCredentialValue as i, resolveCitationRedirectUrl as l, resolveWebSearchProviderCredential as n, setProviderWebSearchPluginConfigValue as o, getScopedCredentialValue as r, setScopedCredentialValue as s, createPluginBackedWebSearchProvider as t };
