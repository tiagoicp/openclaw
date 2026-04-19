import { d as resolveDebugProxySettings } from "./runtime-CMvSHXGk.js";
import { a as mergeModelProviderRequestOverrides, c as resolveProviderRequestPolicyConfig, i as getModelProviderRequestTransport, n as buildProviderRequestDispatcherPolicy } from "./provider-request-config-CxMg2jfc.js";
import { n as fetchWithSsrFGuard } from "./fetch-guard-vsxyWoE4.js";
import { createAssistantMessageEventStream } from "@mariozechner/pi-ai";
//#region src/agents/provider-transport-fetch.ts
function buildManagedResponse(response, release) {
	if (!response.body) {
		release();
		return response;
	}
	const source = response.body;
	let reader;
	let released = false;
	const finalize = async () => {
		if (released) return;
		released = true;
		await release().catch(() => void 0);
	};
	const wrappedBody = new ReadableStream({
		start() {
			reader = source.getReader();
		},
		async pull(controller) {
			try {
				const chunk = await reader?.read();
				if (!chunk || chunk.done) {
					controller.close();
					await finalize();
					return;
				}
				controller.enqueue(chunk.value);
			} catch (error) {
				controller.error(error);
				await finalize();
			}
		},
		async cancel(reason) {
			try {
				await reader?.cancel(reason);
			} finally {
				await finalize();
			}
		}
	});
	return new Response(wrappedBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function resolveModelRequestPolicy(model) {
	const debugProxy = resolveDebugProxySettings();
	let explicitDebugProxyUrl;
	if (debugProxy.enabled && debugProxy.proxyUrl) try {
		if (new URL(model.baseUrl).protocol === "https:") explicitDebugProxyUrl = debugProxy.proxyUrl;
	} catch {}
	const request = mergeModelProviderRequestOverrides(getModelProviderRequestTransport(model), { proxy: explicitDebugProxyUrl ? {
		mode: "explicit-proxy",
		url: explicitDebugProxyUrl
	} : void 0 });
	return resolveProviderRequestPolicyConfig({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		capability: "llm",
		transport: "stream",
		request,
		allowPrivateNetwork: request?.allowPrivateNetwork === true
	});
}
function buildGuardedModelFetch(model) {
	const requestConfig = resolveModelRequestPolicy(model);
	const dispatcherPolicy = buildProviderRequestDispatcherPolicy(requestConfig);
	return async (input, init) => {
		const request = input instanceof Request ? new Request(input, init) : void 0;
		const result = await fetchWithSsrFGuard({
			url: request?.url ?? (input instanceof URL ? input.toString() : typeof input === "string" ? input : (() => {
				throw new Error("Unsupported fetch input for transport-aware model request");
			})()),
			init: (request && {
				method: request.method,
				headers: request.headers,
				body: request.body ?? void 0,
				redirect: request.redirect,
				signal: request.signal,
				...request.body ? { duplex: "half" } : {}
			}) ?? init,
			capture: { meta: {
				provider: model.provider,
				api: model.api,
				model: model.id
			} },
			dispatcherPolicy,
			allowCrossOriginUnsafeRedirectReplay: false,
			...requestConfig.allowPrivateNetwork ? { policy: { allowPrivateNetwork: true } } : {}
		});
		return buildManagedResponse(result.response, result.release);
	};
}
//#endregion
//#region src/agents/transport-message-transform.ts
function appendMissingToolResults(result, pendingToolCalls, existingToolResultIds) {
	for (const toolCall of pendingToolCalls) if (!existingToolResultIds.has(toolCall.id)) result.push({
		role: "toolResult",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		content: [{
			type: "text",
			text: "No result provided"
		}],
		isError: true,
		timestamp: Date.now()
	});
}
function transformTransportMessages(messages, model, normalizeToolCallId) {
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const transformed = messages.map((msg) => {
		if (msg.role === "user") return msg;
		if (msg.role === "toolResult") {
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			return normalizedId && normalizedId !== msg.toolCallId ? {
				...msg,
				toolCallId: normalizedId
			} : msg;
		}
		if (msg.role !== "assistant") return msg;
		const isSameModel = msg.provider === model.provider && msg.api === model.api && msg.model === model.id;
		const content = [];
		for (const block of msg.content) {
			if (block.type === "thinking") {
				if (block.redacted) {
					if (isSameModel) content.push(block);
					continue;
				}
				if (isSameModel && block.thinkingSignature) {
					content.push(block);
					continue;
				}
				if (!block.thinking.trim()) continue;
				content.push(isSameModel ? block : {
					type: "text",
					text: block.thinking
				});
				continue;
			}
			if (block.type === "text") {
				content.push(isSameModel ? block : {
					type: "text",
					text: block.text
				});
				continue;
			}
			if (block.type !== "toolCall") {
				content.push(block);
				continue;
			}
			let normalizedToolCall = block;
			if (!isSameModel && block.thoughtSignature) {
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.thoughtSignature;
			}
			if (!isSameModel && normalizeToolCallId) {
				const normalizedId = normalizeToolCallId(block.id, model, msg);
				if (normalizedId !== block.id) {
					toolCallIdMap.set(block.id, normalizedId);
					normalizedToolCall = {
						...normalizedToolCall,
						id: normalizedId
					};
				}
			}
			content.push(normalizedToolCall);
		}
		return {
			...msg,
			content
		};
	});
	const result = [];
	let pendingToolCalls = [];
	let existingToolResultIds = /* @__PURE__ */ new Set();
	for (const msg of transformed) {
		if (msg.role === "assistant") {
			if (pendingToolCalls.length > 0) {
				appendMissingToolResults(result, pendingToolCalls, existingToolResultIds);
				pendingToolCalls = [];
				existingToolResultIds = /* @__PURE__ */ new Set();
			}
			if (msg.stopReason === "error" || msg.stopReason === "aborted") continue;
			const toolCalls = msg.content.filter((block) => block.type === "toolCall");
			if (toolCalls.length > 0) {
				pendingToolCalls = toolCalls.map((block) => ({
					id: block.id,
					name: block.name
				}));
				existingToolResultIds = /* @__PURE__ */ new Set();
			}
			result.push(msg);
			continue;
		}
		if (msg.role === "toolResult") {
			existingToolResultIds.add(msg.toolCallId);
			result.push(msg);
			continue;
		}
		if (pendingToolCalls.length > 0) {
			appendMissingToolResults(result, pendingToolCalls, existingToolResultIds);
			pendingToolCalls = [];
			existingToolResultIds = /* @__PURE__ */ new Set();
		}
		result.push(msg);
	}
	return result;
}
//#endregion
//#region src/agents/transport-stream-shared.ts
function sanitizeTransportPayloadText(text) {
	return text.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
}
function coerceTransportToolCallArguments(argumentsValue) {
	if (argumentsValue && typeof argumentsValue === "object" && !Array.isArray(argumentsValue)) return argumentsValue;
	if (typeof argumentsValue === "string") try {
		const parsed = JSON.parse(argumentsValue);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {}
	return {};
}
function mergeTransportHeaders(...headerSources) {
	const merged = {};
	for (const headers of headerSources) if (headers) Object.assign(merged, headers);
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function mergeTransportMetadata(payload, metadata) {
	if (!metadata || Object.keys(metadata).length === 0) return payload;
	const existingMetadata = payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata) ? payload.metadata : void 0;
	return {
		...payload,
		metadata: {
			...existingMetadata,
			...metadata
		}
	};
}
function createEmptyTransportUsage() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function createWritableTransportEventStream() {
	const eventStream = createAssistantMessageEventStream();
	return {
		eventStream,
		stream: eventStream
	};
}
function finalizeTransportStream(params) {
	const { stream, output, signal } = params;
	if (signal?.aborted) throw new Error("Request was aborted");
	if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error("An unknown error occurred");
	stream.push({
		type: "done",
		reason: output.stopReason,
		message: output
	});
	stream.end();
}
function failTransportStream(params) {
	const { stream, output, signal, error, cleanup } = params;
	cleanup?.();
	output.stopReason = signal?.aborted ? "aborted" : "error";
	output.errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
	stream.push({
		type: "error",
		reason: output.stopReason,
		error: output
	});
	stream.end();
}
//#endregion
export { finalizeTransportStream as a, sanitizeTransportPayloadText as c, failTransportStream as i, transformTransportMessages as l, createEmptyTransportUsage as n, mergeTransportHeaders as o, createWritableTransportEventStream as r, mergeTransportMetadata as s, coerceTransportToolCallArguments as t, buildGuardedModelFetch as u };
