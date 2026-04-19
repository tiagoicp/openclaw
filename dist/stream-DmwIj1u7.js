import { r as normalizeProviderId } from "./provider-id-D6GoSUK5.js";
import { r as streamWithPayloadPatch } from "./moonshot-thinking-stream-wrappers-CH95-71H.js";
import "./provider-model-shared-Cl567THa.js";
import "./provider-stream-shared-BVj9N0Kb.js";
import { t as isFireworksKimiModelId } from "./model-id-B7CiVwcP.js";
import { streamSimple } from "@mariozechner/pi-ai";
//#region extensions/fireworks/stream.ts
function isFireworksProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "fireworks" || normalized === "fireworks-ai";
}
function createFireworksKimiThinkingDisabledWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => streamWithPayloadPatch(underlying, model, context, options, (payloadObj) => {
		payloadObj.thinking = { type: "disabled" };
		delete payloadObj.reasoning;
		delete payloadObj.reasoning_effort;
		delete payloadObj.reasoningEffort;
	});
}
function wrapFireworksProviderStream(ctx) {
	if (!isFireworksProviderId(ctx.provider) || ctx.model?.api !== "openai-completions" || !isFireworksKimiModelId(ctx.modelId)) return;
	return createFireworksKimiThinkingDisabledWrapper(ctx.streamFn);
}
//#endregion
export { wrapFireworksProviderStream as n, createFireworksKimiThinkingDisabledWrapper as t };
