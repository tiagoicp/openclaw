import { i as formatErrorMessage } from "./errors-D8p6rxH8.js";
import { o as normalizeOptionalLowercaseString } from "./string-coerce-BUSzWgUA.js";
import { r as normalizeChatChannelId } from "./ids-CMOTfTrB.js";
import { n as getBundledChannelPlugin } from "./bundled-OUpYfB5_.js";
import "./registry-B7jNXbbw.js";
import { i as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-iW4sIPEh.js";
import { p as resolveSessionAgentId } from "./agent-scope-DsH_ZwEW.js";
import { u as normalizeMessageChannel } from "./message-channel-S0mPg8y2.js";
import "./message-channel-core-J9n45NG7.js";
import "./plugins-RAm7ylrL.js";
import { r as resolveEffectiveMessagesConfig } from "./identity-CV1tmBet.js";
import { i as hasReplyPayloadContent } from "./payload-CE1SfZ6p.js";
import { a as shouldSuppressReasoningPayload, r as formatBtwTextForExternalDelivery } from "./reply-payloads-W6x0SpS1.js";
import { t as buildOutboundSessionContext } from "./session-context-DEXt_xBD.js";
import { t as normalizeReplyPayload } from "./normalize-reply-BMZaJ3Ct.js";
//#region src/auto-reply/reply/route-reply.ts
/**
* Provider-agnostic reply router.
*
* Routes replies to the originating channel based on OriginatingChannel/OriginatingTo
* instead of using the session's lastChannel. This ensures replies go back to the
* provider where the message originated, even when the main session is shared
* across multiple providers.
*/
let deliverRuntimePromise = null;
function loadDeliverRuntime() {
	deliverRuntimePromise ??= import("./deliver-runtime-bZjQ8Y3P.js");
	return deliverRuntimePromise;
}
/**
* Routes a reply payload to the specified channel.
*
* This function provides a unified interface for sending messages to any
* supported provider. It's used by the followup queue to route replies
* back to the originating channel when OriginatingChannel/OriginatingTo
* are set.
*/
async function routeReply(params) {
	const { payload, channel, to, accountId, threadId, cfg, abortSignal } = params;
	if (shouldSuppressReasoningPayload(payload)) return { ok: true };
	const normalizedChannel = normalizeMessageChannel(channel);
	const channelId = normalizeChannelId(channel) ?? normalizeOptionalLowercaseString(channel) ?? null;
	const plugin = channelId ? getLoadedChannelPlugin(channelId) ?? getBundledChannelPlugin(channelId) : void 0;
	const messaging = plugin?.messaging;
	const threading = plugin?.threading;
	const resolvedAgentId = params.sessionKey ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: cfg
	}) : void 0;
	const normalized = normalizeReplyPayload(payload, {
		responsePrefix: params.sessionKey ? resolveEffectiveMessagesConfig(cfg, resolvedAgentId ?? resolveSessionAgentId({ config: cfg }), {
			channel: normalizedChannel,
			accountId
		}).responsePrefix : cfg.messages?.responsePrefix === "auto" ? void 0 : cfg.messages?.responsePrefix,
		transformReplyPayload: messaging?.transformReplyPayload ? (nextPayload) => messaging.transformReplyPayload?.({
			payload: nextPayload,
			cfg,
			accountId
		}) ?? nextPayload : void 0
	});
	if (!normalized) return { ok: true };
	const externalPayload = {
		...normalized,
		text: formatBtwTextForExternalDelivery(normalized)
	};
	let text = externalPayload.text ?? "";
	let mediaUrls = (externalPayload.mediaUrls?.filter(Boolean) ?? []).length ? externalPayload.mediaUrls?.filter(Boolean) : externalPayload.mediaUrl ? [externalPayload.mediaUrl] : [];
	const replyToId = externalPayload.replyToId;
	const hasChannelData = messaging?.hasStructuredReplyPayload?.({ payload: externalPayload });
	if (!hasReplyPayloadContent({
		...externalPayload,
		text,
		mediaUrls
	}, { hasChannelData })) return { ok: true };
	if (channel === "webchat") return {
		ok: false,
		error: "Webchat routing not supported for queued replies"
	};
	if (!channelId) return {
		ok: false,
		error: `Unknown channel: ${String(channel)}`
	};
	if (abortSignal?.aborted) return {
		ok: false,
		error: "Reply routing aborted"
	};
	const replyTransport = threading?.resolveReplyTransport?.({
		cfg,
		accountId,
		threadId,
		replyToId
	}) ?? null;
	const resolvedReplyToId = replyTransport?.replyToId ?? replyToId ?? void 0;
	const resolvedThreadId = replyTransport && Object.hasOwn(replyTransport, "threadId") ? replyTransport.threadId ?? null : threadId ?? null;
	try {
		const { deliverOutboundPayloads } = await loadDeliverRuntime();
		const outboundSession = buildOutboundSessionContext({
			cfg,
			agentId: resolvedAgentId,
			sessionKey: params.sessionKey,
			requesterSenderId: params.requesterSenderId,
			requesterSenderName: params.requesterSenderName,
			requesterSenderUsername: params.requesterSenderUsername,
			requesterSenderE164: params.requesterSenderE164
		});
		return {
			ok: true,
			messageId: (await deliverOutboundPayloads({
				cfg,
				channel: channelId,
				to,
				accountId: accountId ?? void 0,
				payloads: [externalPayload],
				replyToId: resolvedReplyToId ?? null,
				threadId: resolvedThreadId,
				session: outboundSession,
				abortSignal,
				mirror: params.mirror !== false && params.sessionKey ? {
					sessionKey: params.sessionKey,
					agentId: resolvedAgentId,
					text,
					mediaUrls,
					...params.isGroup != null ? { isGroup: params.isGroup } : {},
					...params.groupId ? { groupId: params.groupId } : {}
				} : void 0
			})).at(-1)?.messageId
		};
	} catch (err) {
		return {
			ok: false,
			error: `Failed to route reply to ${channel}: ${formatErrorMessage(err)}`
		};
	}
}
/**
* Checks if a channel type is routable via routeReply.
*
* Some channels (webchat) require special handling and cannot be routed through
* this generic interface.
*/
function isRoutableChannel(channel) {
	if (!channel || channel === "webchat") return false;
	return normalizeChatChannelId(channel) !== null || normalizeChannelId(channel) !== null;
}
//#endregion
export { routeReply as n, isRoutableChannel as t };
