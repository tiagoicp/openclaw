import { r as normalizeNativeXaiModelId } from "../../provider-model-id-normalize-ZD1o41MT.js";
import { f as resolveXaiModelCompatPatch, i as applyXaiModelCompat } from "../../provider-tools-CpuBYaLK.js";
import { c as jsonResult } from "../../common-D14k4EfX.js";
import { p as readProviderEnvValue } from "../../web-search-provider-common-BmFUgiaQ.js";
import { r as OPENAI_COMPATIBLE_REPLAY_HOOKS } from "../../provider-model-shared-Cl567THa.js";
import { s as defaultToolStreamExtraParams } from "../../provider-stream-shared-BVj9N0Kb.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cn-adoN0.js";
import "../../provider-web-search-BDDWOAP5.js";
import { t as buildXaiProvider } from "../../provider-catalog-BZB5Uy5s.js";
import { n as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-BrbtpvtZ.js";
import { n as resolveXaiForwardCompatModel, t as isModernXaiModel } from "../../provider-models-DdNRI6rB.js";
import { n as resolveXaiTransport, r as shouldContributeXaiCompat } from "../../api-B_XY56mV.js";
import { n as resolveFallbackXaiAuth } from "../../tool-auth-shared-Cr8A3-rZ.js";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-DHumcZ9u.js";
import { i as wrapXaiProviderStream } from "../../stream-D5IfxwZG.js";
import { t as buildXaiVideoGenerationProvider } from "../../video-generation-provider-Dxcg_zrK.js";
import { t as createXaiWebSearchProvider } from "../../web-search-DFKN2GpL.js";
import { n as createXSearchToolDefinition, t as buildMissingXSearchApiKeyPayload } from "../../x-search-tool-shared--M7uGurF.js";
import { Type } from "@sinclair/typebox";
//#region extensions/xai/index.ts
const PROVIDER_ID = "xai";
let codeExecutionModulePromise;
let xSearchModulePromise;
function loadCodeExecutionModule() {
	codeExecutionModulePromise ??= import("./code-execution.js");
	return codeExecutionModulePromise;
}
function loadXSearchModule() {
	xSearchModulePromise ??= import("./x-search.js");
	return xSearchModulePromise;
}
function hasResolvableXaiApiKey(config) {
	return Boolean(resolveFallbackXaiAuth(config)?.apiKey || readProviderEnvValue(["XAI_API_KEY"]));
}
function isCodeExecutionEnabled(config) {
	if (!config || typeof config !== "object") return hasResolvableXaiApiKey(config);
	const entries = config.plugins;
	const pluginEntries = entries && typeof entries === "object" ? entries.entries : void 0;
	const xaiEntry = pluginEntries && typeof pluginEntries.xai === "object" ? pluginEntries.xai : void 0;
	const pluginConfig = xaiEntry && typeof xaiEntry.config === "object" ? xaiEntry.config : void 0;
	if ((pluginConfig && typeof pluginConfig.codeExecution === "object" ? pluginConfig.codeExecution : void 0)?.enabled === false) return false;
	return hasResolvableXaiApiKey(config);
}
function isXSearchEnabled(config) {
	if ((config && typeof config === "object" ? resolveEffectiveXSearchConfig(config) : void 0)?.enabled === false) return false;
	return hasResolvableXaiApiKey(config);
}
function createLazyCodeExecutionTool(ctx) {
	if (!isCodeExecutionEnabled(ctx.runtimeConfig ?? ctx.config)) return null;
	return {
		label: "Code Execution",
		name: "code_execution",
		description: "Run sandboxed Python analysis with xAI. Use for calculations, tabulation, summaries, and chart-style analysis without local machine access.",
		parameters: Type.Object({ task: Type.String({ description: "The full analysis task for xAI's remote Python sandbox. Include any data to analyze directly in the task." }) }),
		execute: async (toolCallId, args) => {
			const { createCodeExecutionTool } = await loadCodeExecutionModule();
			const tool = createCodeExecutionTool({
				config: ctx.config,
				runtimeConfig: ctx.runtimeConfig ?? null
			});
			if (!tool) return jsonResult({
				error: "missing_xai_api_key",
				message: "code_execution needs an xAI API key. Set XAI_API_KEY in the Gateway environment, or configure plugins.entries.xai.config.webSearch.apiKey.",
				docs: "https://docs.openclaw.ai/tools/code-execution"
			});
			return await tool.execute(toolCallId, args);
		}
	};
}
function createLazyXSearchTool(ctx) {
	if (!isXSearchEnabled(ctx.runtimeConfig ?? ctx.config)) return null;
	return createXSearchToolDefinition(async (toolCallId, args) => {
		const { createXSearchTool } = await loadXSearchModule();
		const tool = createXSearchTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null
		});
		if (!tool) return jsonResult(buildMissingXSearchApiKeyPayload());
		return await tool.execute(toolCallId, args);
	});
}
var xai_default = defineSingleProviderPluginEntry({
	id: "xai",
	name: "xAI Plugin",
	description: "Bundled xAI plugin",
	provider: {
		label: "xAI",
		aliases: ["x-ai"],
		docsPath: "/providers/xai",
		auth: [{
			methodId: "api-key",
			label: "xAI API key",
			hint: "API key",
			optionKey: "xaiApiKey",
			flagName: "--xai-api-key",
			envVar: "XAI_API_KEY",
			promptMessage: "Enter xAI API key",
			defaultModel: XAI_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyXaiConfig(cfg),
			wizard: { groupLabel: "xAI (Grok)" }
		}],
		catalog: { buildProvider: buildXaiProvider },
		...OPENAI_COMPATIBLE_REPLAY_HOOKS,
		prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
		wrapStreamFn: wrapXaiProviderStream,
		resolveSyntheticAuth: ({ config }) => {
			const fallbackAuth = resolveFallbackXaiAuth(config);
			if (!fallbackAuth) return;
			return {
				apiKey: fallbackAuth.apiKey,
				source: fallbackAuth.source,
				mode: "api-key"
			};
		},
		normalizeResolvedModel: ({ model }) => applyXaiModelCompat(model),
		normalizeTransport: ({ provider, api, baseUrl }) => resolveXaiTransport({
			provider,
			api,
			baseUrl
		}),
		contributeResolvedModelCompat: ({ modelId, model }) => shouldContributeXaiCompat({
			modelId,
			model
		}) ? resolveXaiModelCompatPatch() : void 0,
		normalizeModelId: ({ modelId }) => normalizeNativeXaiModelId(modelId),
		resolveDynamicModel: (ctx) => resolveXaiForwardCompatModel({
			providerId: PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isModernXaiModel(modelId)
	},
	register(api) {
		api.registerWebSearchProvider(createXaiWebSearchProvider());
		api.registerVideoGenerationProvider(buildXaiVideoGenerationProvider());
		api.registerTool((ctx) => createLazyCodeExecutionTool(ctx), { name: "code_execution" });
		api.registerTool((ctx) => createLazyXSearchTool(ctx), { name: "x_search" });
	}
});
//#endregion
export { xai_default as default };
