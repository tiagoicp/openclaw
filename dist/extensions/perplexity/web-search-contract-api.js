import { i as resolveProviderWebSearchPluginConfig, r as mergeScopedSearchConfig } from "../../web-search-provider-config-C0zCtpJB.js";
import { t as createBaseWebSearchProviderContractFields } from "../../provider-web-search-contract-fields-CmmpGN3U.js";
import { a as resolvePerplexityRuntimeTransport } from "../../perplexity-web-search-provider.shared-DE169QCA.js";
//#region extensions/perplexity/web-search-contract-api.ts
function createPerplexityWebSearchProvider() {
	const credentialPath = "plugins.entries.perplexity.config.webSearch.apiKey";
	return {
		id: "perplexity",
		label: "Perplexity Search",
		hint: "Requires Perplexity API key or OpenRouter API key · structured results",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Perplexity API key",
		envVars: ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
		placeholder: "pplx-...",
		signupUrl: "https://www.perplexity.ai/settings/api",
		docsUrl: "https://docs.openclaw.ai/perplexity",
		autoDetectOrder: 50,
		credentialPath,
		...createBaseWebSearchProviderContractFields({
			credentialPath,
			searchCredential: {
				type: "scoped",
				scopeId: "perplexity"
			},
			configuredCredential: { pluginId: "perplexity" }
		}),
		resolveRuntimeMetadata: (ctx) => ({ perplexityTransport: resolvePerplexityRuntimeTransport({
			searchConfig: mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity")),
			resolvedKey: ctx.resolvedCredential?.value,
			keySource: ctx.resolvedCredential?.source ?? "missing",
			fallbackEnvVar: ctx.resolvedCredential?.fallbackEnvVar
		}) }),
		createTool: () => null
	};
}
//#endregion
export { createPerplexityWebSearchProvider };
