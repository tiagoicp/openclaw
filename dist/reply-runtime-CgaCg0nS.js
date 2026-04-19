import { r as logVerbose } from "./globals-BW15qYpX.js";
import { o as resolveDefaultModelForAgent } from "./model-selection-C05AhLK_.js";
import { t as requireApiKey } from "./model-auth-runtime-shared-D8VYLkAp.js";
import "./tokens-BC6Cn5aq.js";
import "./heartbeat-D2SoAji-.js";
import { r as getApiKeyForModel } from "./model-auth-BKyXLO-t.js";
import "./chunk-BwGwtTwh.js";
import { n as resolveModelAsync } from "./model-B7HWI1pe.js";
import "./dispatch-BNrqotrK.js";
import "./provider-dispatcher-CW-G6Za3.js";
import "./get-reply-DVz6hGrv.js";
import "./abort-5CV2bZoJ.js";
import "./btw-command-CnQygxZx.js";
import { t as prepareModelForSimpleCompletion } from "./simple-completion-transport-DMoULknu.js";
import { completeSimple } from "@mariozechner/pi-ai";
//#region src/auto-reply/reply/conversation-label-generator.ts
const DEFAULT_MAX_LABEL_LENGTH = 128;
const TIMEOUT_MS = 15e3;
function isTextContentBlock(block) {
	return block.type === "text";
}
async function generateConversationLabel(params) {
	const { userMessage, prompt, cfg, agentId, agentDir } = params;
	const maxLength = typeof params.maxLength === "number" && Number.isFinite(params.maxLength) && params.maxLength > 0 ? Math.floor(params.maxLength) : DEFAULT_MAX_LABEL_LENGTH;
	const modelRef = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const resolved = await resolveModelAsync(modelRef.provider, modelRef.model, agentDir, cfg);
	if (!resolved.model) {
		logVerbose(`conversation-label-generator: failed to resolve model ${modelRef.provider}/${modelRef.model}`);
		return null;
	}
	const completionModel = prepareModelForSimpleCompletion({
		model: resolved.model,
		cfg
	});
	const apiKey = requireApiKey(await getApiKeyForModel({
		model: completionModel,
		cfg,
		agentDir
	}), modelRef.provider);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const text = (await completeSimple(completionModel, { messages: [{
			role: "user",
			content: `${prompt}\n\n${userMessage}`,
			timestamp: Date.now()
		}] }, {
			apiKey,
			maxTokens: 100,
			temperature: .3,
			signal: controller.signal
		})).content.filter(isTextContentBlock).map((block) => block.text).join("").trim();
		if (!text) return null;
		return text.slice(0, maxLength);
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
export { generateConversationLabel as t };
