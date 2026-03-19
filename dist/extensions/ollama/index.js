import "../../logger-Qep7Kkk8.js";
import "../../paths-C--RM-nt.js";
import "../../tmp-openclaw-dir-DHiu0fYi.js";
import "../../theme-CWrxY1-_.js";
import "../../globals-ir4cuPXg.js";
import "../../subsystem-DZirmh0Z.js";
import "../../ansi-cwY8Vrne.js";
import "../../utils-DHW4u72m.js";
import "../../model-selection-CnnQfpX3.js";
import "../../agent-scope-CjT_nq79.js";
import "../../boundary-path-C6aAhZ_Z.js";
import "../../boundary-file-read-C_4eDsgv.js";
import "../../logger-Cpn1HYqp.js";
import "../../exec-CmLTXzPB.js";
import "../../workspace-v-lU9b6K.js";
import "../../registry-B1w4aWmD.js";
import "../../zod-schema.core-Ck0QyHFp.js";
import "../../resolve-route-C0w3Gg7m.js";
import "../../config-schema-DxpGRv8-.js";
import { i as definePluginEntry } from "../../core-DczSNd0Z.js";
import { et as resolveOllamaApiBase, in as OLLAMA_DEFAULT_BASE_URL } from "../../provider-models-CUuE-GPt.js";
import "../../provider-onboard-CTDjrzVM.js";
import "../../model-definitions-DMtyKAcZ.js";
import "../../delegate-CWt-W_4V.js";
import "../../secret-file-BhPVdZGQ.js";
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
