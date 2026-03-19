import "../../logger-Bisu6sgz.js";
import "../../paths-D_QmduAc.js";
import "../../tmp-openclaw-dir-CEAo8CGE.js";
import "../../theme-Bnch_o1K.js";
import "../../globals-CnsLPQis.js";
import "../../subsystem-Dm-AQqmI.js";
import "../../ansi-BMqrB9En.js";
import "../../utils-CIAfMgvq.js";
import "../../model-selection-BvgYPMZN.js";
import "../../agent-scope-BvOTVsJZ.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-DcSg74GU.js";
import "../../exec-Bwz57vWc.js";
import "../../workspace-C3BQkKrq.js";
import "../../registry-DHFXbGRB.js";
import "../../zod-schema.core-2nNLrIvV.js";
import "../../resolve-route-BKJ_gx17.js";
import "../../config-schema-SbU9iMOP.js";
import { i as definePluginEntry } from "../../core-DoWJeX1b.js";
import { et as resolveOllamaApiBase, in as OLLAMA_DEFAULT_BASE_URL } from "../../provider-models-mqi97xJa.js";
import "../../provider-onboard-YZwyyz0l.js";
import "../../model-definitions-CPk0fx2x.js";
import "../../delegate-VRfyt_wr.js";
import "../../secret-file-C6VA1we_.js";
//#region extensions/ollama/index.ts
const PROVIDER_ID = "ollama";
const DEFAULT_API_KEY = "ollama-local";
async function loadProviderSetup() {
	return await import("../../plugin-sdk/ollama-setup.js");
}
var ollama_default = definePluginEntry({
	id: "ollama",
	name: "Ollama Provider",
	description: "Bundled Ollama provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Ollama",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [{
				id: "local",
				label: "Ollama",
				hint: "Cloud and local open models",
				kind: "custom",
				run: async (ctx) => {
					const result = await (await loadProviderSetup()).promptAndConfigureOllama({
						cfg: ctx.config,
						prompter: ctx.prompter
					});
					return {
						profiles: [{
							profileId: "ollama:default",
							credential: {
								type: "api_key",
								provider: PROVIDER_ID,
								key: DEFAULT_API_KEY
							}
						}],
						configPatch: result.config,
						defaultModel: `ollama/${result.defaultModelId}`
					};
				},
				runNonInteractive: async (ctx) => {
					return await (await loadProviderSetup()).configureOllamaNonInteractive({
						nextConfig: ctx.config,
						opts: ctx.opts,
						runtime: ctx.runtime
					});
				}
			}],
			discovery: {
				order: "late",
				run: async (ctx) => {
					const explicit = ctx.config.models?.providers?.ollama;
					const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
					const ollamaKey = ctx.resolveProviderApiKey(PROVIDER_ID).apiKey;
					if (hasExplicitModels && explicit) return { provider: {
						...explicit,
						baseUrl: typeof explicit.baseUrl === "string" && explicit.baseUrl.trim() ? resolveOllamaApiBase(explicit.baseUrl) : OLLAMA_DEFAULT_BASE_URL,
						api: explicit.api ?? "ollama",
						apiKey: ollamaKey ?? explicit.apiKey ?? DEFAULT_API_KEY
					} };
					const provider = await (await loadProviderSetup()).buildOllamaProvider(explicit?.baseUrl, { quiet: !ollamaKey && !explicit });
					if (provider.models.length === 0 && !ollamaKey && !explicit?.apiKey) return null;
					return { provider: {
						...provider,
						apiKey: ollamaKey ?? explicit?.apiKey ?? DEFAULT_API_KEY
					} };
				}
			},
			wizard: {
				setup: {
					choiceId: "ollama",
					choiceLabel: "Ollama",
					choiceHint: "Cloud and local open models",
					groupId: "ollama",
					groupLabel: "Ollama",
					groupHint: "Cloud and local open models",
					methodId: "local"
				},
				modelPicker: {
					label: "Ollama (custom)",
					hint: "Detect models from a local or remote Ollama instance",
					methodId: "local"
				}
			},
			onModelSelected: async ({ config, model, prompter }) => {
				if (!model.startsWith("ollama/")) return;
				await (await loadProviderSetup()).ensureOllamaModelPulled({
					config,
					prompter
				});
			}
		});
	}
});
//#endregion
export { ollama_default as default };
