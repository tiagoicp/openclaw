import { a as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CpuBYaLK.js";
import { t as definePluginEntry } from "../../plugin-entry-Dzt3gEtQ.js";
import { t as buildOpenAICodexCliBackend } from "../../cli-backend-CZPyf-aO.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-DFrn77p8.js";
import { n as openaiCodexMediaUnderstandingProvider, r as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-BD-vFUOu.js";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-C1Xk0FT2.js";
import { t as buildOpenAICodexProviderPlugin } from "../../openai-codex-provider-C-zBti-G.js";
import { t as buildOpenAIProvider } from "../../openai-provider-hUlWVNAa.js";
import { a as resolveOpenAIPromptOverlayMode, o as resolveOpenAISystemPromptContribution } from "../../prompt-overlay-CtxMk6hX.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-DZCmVMqO.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-BGDEvxa-.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-Py97N-fU.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-BEbrjMaM.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const promptOverlayMode = resolveOpenAIPromptOverlayMode(api.pluginConfig);
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const buildProviderWithPromptContribution = (provider) => ({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => resolveOpenAISystemPromptContribution({
				mode: promptOverlayMode,
				modelProviderId: provider.id,
				modelId: ctx.modelId
			})
		});
		api.registerCliBackend(buildOpenAICodexCliBackend());
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAICodexProviderPlugin()));
		api.registerMemoryEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(openaiCodexMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
