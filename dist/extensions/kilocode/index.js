import { i as PASSTHROUGH_GEMINI_REPLAY_HOOKS } from "../../provider-model-shared-Cl567THa.js";
import { n as readConfiguredProviderCatalogEntries } from "../../provider-catalog-shared-WlJCcG8_.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Cn-adoN0.js";
import { n as KILOCODE_THINKING_STREAM_HOOKS } from "../../provider-stream-CMZdYhRI.js";
import "../../provider-stream-family-8iu_T9bk.js";
import { s as KILOCODE_DEFAULT_MODEL_REF } from "../../provider-models-v0m_TfDE.js";
import { n as buildKilocodeProviderWithDiscovery } from "../../provider-catalog-0CcYOUng.js";
import { t as applyKilocodeConfig } from "../../onboard-BofvRpoU.js";
//#region extensions/kilocode/index.ts
const PROVIDER_ID = "kilocode";
var kilocode_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Kilo Gateway Provider",
	description: "Bundled Kilo Gateway provider plugin",
	provider: {
		label: "Kilo Gateway",
		docsPath: "/providers/kilocode",
		auth: [{
			methodId: "api-key",
			label: "Kilo Gateway API key",
			hint: "API key (OpenRouter-compatible)",
			optionKey: "kilocodeApiKey",
			flagName: "--kilocode-api-key",
			envVar: "KILOCODE_API_KEY",
			promptMessage: "Enter Kilo Gateway API key",
			defaultModel: KILOCODE_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyKilocodeConfig(cfg)
		}],
		catalog: { buildProvider: buildKilocodeProviderWithDiscovery },
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...PASSTHROUGH_GEMINI_REPLAY_HOOKS,
		...KILOCODE_THINKING_STREAM_HOOKS,
		isCacheTtlEligible: (ctx) => ctx.modelId.startsWith("anthropic/")
	}
});
//#endregion
export { kilocode_default as default };
