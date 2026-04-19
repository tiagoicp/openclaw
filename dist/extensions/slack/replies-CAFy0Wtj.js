import { t as SLACK_TEXT_LIMIT } from "./limits-BmJsbgo5.js";
import { t as resolveSlackReplyBlocks } from "./reply-blocks-C5jks2j_.js";
import { n as markdownToSlackMrkdwnChunks, t as sendMessageSlack } from "./send-DvH4LM5S.js";
import { i as createReplyReferencePlanner, n as chunkMarkdownTextWithMode, s as isSilentReplyText, t as SILENT_REPLY_TOKEN } from "./send.runtime-2UOT_qiI.js";
import { getGlobalHookRunner } from "openclaw/plugin-sdk/plugin-runtime";
import { resolveSendableOutboundReplyParts } from "openclaw/plugin-sdk/reply-payload";
import { buildCanonicalSentMessageHookContext, createInternalHookEvent, fireAndForgetHook, toInternalMessageSentContext, toPluginMessageContext, toPluginMessageSentEvent, triggerInternalHook } from "openclaw/plugin-sdk/hook-runtime";
//#region extensions/slack/src/monitor/replies.ts
function readSlackReplyBlocks(payload) {
	return resolveSlackReplyBlocks(payload);
}
function emitSlackMessageSentHooks(params) {
	if (!params.enabled && !params.sessionKeyForInternalHooks) return;
	const canonical = buildCanonicalSentMessageHookContext({
		to: params.target,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: "slack",
		accountId: params.accountId,
		conversationId: params.target,
		messageId: params.messageId
	});
	if (params.enabled) fireAndForgetHook(Promise.resolve(params.hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical))), "slack: message_sent plugin hook failed");
	if (!params.sessionKeyForInternalHooks) return;
	fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), "slack: message:sent internal hook failed");
}
async function deliverReplies(params) {
	const hookRunner = getGlobalHookRunner();
	const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
	const hasMessageSentHooks = hookRunner?.hasHooks("message_sent") ?? false;
	for (let originalPayload of params.replies) {
		let payload = originalPayload;
		const threadTs = (params.replyToMode === "off" ? void 0 : payload.replyToId) ?? params.replyThreadTs;
		const mediaList = payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : []);
		const text = payload.text ?? "";
		const slackBlocks = resolveSlackReplyBlocks(payload);
		if (!text && mediaList.length === 0 && !slackBlocks?.length) continue;
		if (hasMessageSendingHooks) {
			const hookResult = await hookRunner?.runMessageSending({
				to: params.target,
				content: text,
				metadata: {
					channel: "slack",
					mediaUrls: mediaList
				}
			}, {
				channelId: "slack",
				accountId: params.accountId,
				conversationId: params.target
			});
			if (hookResult?.cancel) continue;
			if (typeof hookResult?.content === "string" && hookResult.content !== text) payload = {
				...payload,
				text: hookResult.content
			};
		}
		const contentForSentHook = payload.text ?? "";
		try {
			let firstMessageId;
			if (mediaList.length === 0) {
				const trimmed = (payload.text ?? "").trim();
				if (!trimmed && !slackBlocks?.length) continue;
				if (trimmed && isSilentReplyText(trimmed, SILENT_REPLY_TOKEN)) continue;
				firstMessageId = (await sendMessageSlack(params.target, trimmed, {
					token: params.token,
					threadTs,
					accountId: params.accountId,
					...slackBlocks?.length ? { blocks: slackBlocks } : {},
					...params.identity ? { identity: params.identity } : {}
				})).messageId;
			} else {
				let first = true;
				for (const mediaUrl of mediaList) {
					const caption = first ? payload.text ?? "" : "";
					first = false;
					const result = await sendMessageSlack(params.target, caption, {
						token: params.token,
						mediaUrl,
						threadTs,
						accountId: params.accountId,
						...params.identity ? { identity: params.identity } : {}
					});
					firstMessageId ??= result.messageId;
				}
			}
			emitSlackMessageSentHooks({
				hookRunner,
				enabled: hasMessageSentHooks,
				sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
				target: params.target,
				accountId: params.accountId,
				content: contentForSentHook,
				success: true,
				messageId: firstMessageId
			});
		} catch (error) {
			emitSlackMessageSentHooks({
				hookRunner,
				enabled: hasMessageSentHooks,
				sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
				target: params.target,
				accountId: params.accountId,
				content: contentForSentHook,
				success: false,
				error: error instanceof Error ? error.message : String(error)
			});
			throw error;
		}
	}
}
/**
* Compute effective threadTs for a Slack reply based on replyToMode.
* - "off": stay in thread if already in one, otherwise main channel
* - "first": first reply goes to thread, subsequent replies to main channel
* - "all": all replies go to thread
*/
function resolveSlackThreadTs(params) {
	return createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasReplied,
		isThreadReply: params.isThreadReply
	}).use();
}
function createSlackReplyReferencePlanner(params) {
	return createReplyReferencePlanner({
		replyToMode: params.isThreadReply ?? Boolean(params.incomingThreadTs && params.incomingThreadTs !== params.messageTs) ? "all" : params.replyToMode,
		existingId: params.incomingThreadTs,
		startId: params.messageTs,
		hasReplied: params.hasReplied
	});
}
function createSlackReplyDeliveryPlan(params) {
	const replyReference = createSlackReplyReferencePlanner({
		replyToMode: params.replyToMode,
		incomingThreadTs: params.incomingThreadTs,
		messageTs: params.messageTs,
		hasReplied: params.hasRepliedRef.value,
		isThreadReply: params.isThreadReply
	});
	return {
		nextThreadTs: () => replyReference.use(),
		markSent: () => {
			replyReference.markSent();
			params.hasRepliedRef.value = replyReference.hasReplied();
		}
	};
}
async function deliverSlackSlashReplies(params) {
	const messages = [];
	const chunkLimit = Math.min(params.textLimit, SLACK_TEXT_LIMIT);
	for (const payload of params.replies) {
		const reply = resolveSendableOutboundReplyParts(payload);
		const combined = [(reply.hasText && !isSilentReplyText(reply.trimmedText, SILENT_REPLY_TOKEN) ? reply.trimmedText : void 0) ?? "", ...reply.mediaUrls].filter(Boolean).join("\n");
		if (!combined) continue;
		const chunkMode = params.chunkMode ?? "length";
		const chunks = (chunkMode === "newline" ? chunkMarkdownTextWithMode(combined, chunkLimit, chunkMode) : [combined]).flatMap((markdown) => markdownToSlackMrkdwnChunks(markdown, chunkLimit, { tableMode: params.tableMode }));
		if (!chunks.length && combined) chunks.push(combined);
		for (const chunk of chunks) messages.push(chunk);
	}
	if (messages.length === 0) return;
	const responseType = params.ephemeral ? "ephemeral" : "in_channel";
	for (const text of messages) await params.respond({
		text,
		response_type: responseType
	});
}
//#endregion
export { resolveSlackThreadTs as a, readSlackReplyBlocks as i, deliverReplies as n, deliverSlackSlashReplies as r, createSlackReplyDeliveryPlan as t };
