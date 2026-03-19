import { G as buildSlackInteractiveBlocks, Gg as getGlobalHookRunner, ei as createReplyReferencePlanner, rb as parseSlackBlocksInput, st as sendMessageSlack, ut as markdownToSlackMrkdwnChunks, wm as isSilentReplyText } from "./auth-profiles-BqVjFbSG.js";
import { b as chunkMarkdownTextWithMode } from "./text-runtime-DD-uemN_.js";
import { a as toInternalMessageSentContext, d as toPluginMessageSentEvent, f as fireAndForgetHook, l as toPluginMessageContext, t as buildCanonicalSentMessageHookContext } from "./hook-runtime-M4GviJQN.js";
import { d as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-jmovcAUX.js";
//#region extensions/slack/src/monitor/replies.ts
function readSlackReplyBlocks(payload) {
	const slackData = payload.channelData?.slack;
	if (!slackData || typeof slackData !== "object" || Array.isArray(slackData)) return;
	try {
		return parseSlackBlocksInput(slackData.blocks);
	} catch {
		return;
	}
}
/**
* Resolve all Slack blocks for delivery by merging pre-formatted channelData.slack.blocks
* with blocks rendered from the generic interactive payload (e.g. [[slack_buttons:]] directives).
*/
function resolveSlackReplyBlocks(payload) {
	const channelDataBlocks = readSlackReplyBlocks(payload);
	const interactiveBlocks = payload.interactive ? buildSlackInteractiveBlocks(payload.interactive) : void 0;
	const merged = [...channelDataBlocks ?? [], ...interactiveBlocks ?? []];
	return merged.length > 0 ? merged : void 0;
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
				if (trimmed && isSilentReplyText(trimmed, "NO_REPLY")) continue;
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
		params.runtime.log?.(`delivered reply to ${params.target}`);
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
		replyToMode: params.isThreadReply ?? Boolean(params.incomingThreadTs) ? "all" : params.replyToMode,
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
	const chunkLimit = Math.min(params.textLimit, 4e3);
	for (const payload of params.replies) {
		const textRaw = payload.text?.trim() ?? "";
		const text = textRaw && !isSilentReplyText(textRaw, "NO_REPLY") ? textRaw : void 0;
		const mediaList = payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : []);
		const combined = [text ?? "", ...mediaList.map((url) => url.trim()).filter(Boolean)].filter(Boolean).join("\n");
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
export { resolveSlackThreadTs as a, resolveSlackReplyBlocks as i, deliverReplies as n, deliverSlackSlashReplies as r, createSlackReplyDeliveryPlan as t };
