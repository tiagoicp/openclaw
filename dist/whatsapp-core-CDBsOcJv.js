import { l as escapeRegExp } from "./utils-CIAfMgvq.js";
import { S as isWhatsAppGroupJid, w as normalizeWhatsAppTarget } from "./channel-config-helpers-DgtPbGwx.js";
import { n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "./channel-policy-DpLpqCrB.js";
//#region extensions/whatsapp/src/group-policy.ts
function resolveWhatsAppGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "whatsapp",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
function resolveWhatsAppGroupToolPolicy(params) {
	return resolveChannelGroupToolsPolicy({
		cfg: params.cfg,
		channel: "whatsapp",
		groupId: params.groupId,
		accountId: params.accountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
//#region src/infra/outbound/send-deps.ts
const LEGACY_SEND_DEP_KEYS = {
	whatsapp: "sendWhatsApp",
	telegram: "sendTelegram",
	discord: "sendDiscord",
	slack: "sendSlack",
	signal: "sendSignal",
	imessage: "sendIMessage",
	matrix: "sendMatrix",
	msteams: "sendMSTeams"
};
function resolveOutboundSendDep(deps, channelId) {
	const dynamic = deps?.[channelId];
	if (dynamic !== void 0) return dynamic;
	const legacyKey = LEGACY_SEND_DEP_KEYS[channelId];
	return deps?.[legacyKey];
}
//#endregion
//#region src/infra/outbound/target-errors.ts
function missingTargetMessage(provider, hint) {
	return `Delivering to ${provider} requires target${formatTargetHint(hint)}`;
}
function missingTargetError(provider, hint) {
	return new Error(missingTargetMessage(provider, hint));
}
function ambiguousTargetMessage(provider, raw, hint) {
	return `Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`;
}
function ambiguousTargetError(provider, raw, hint) {
	return new Error(ambiguousTargetMessage(provider, raw, hint));
}
function unknownTargetMessage(provider, raw, hint) {
	return `Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`;
}
function unknownTargetError(provider, raw, hint) {
	return new Error(unknownTargetMessage(provider, raw, hint));
}
function formatTargetHint(hint, withLabel = false) {
	const normalized = hint?.trim();
	if (!normalized) return "";
	return withLabel ? ` Hint: ${normalized}` : ` ${normalized}`;
}
//#endregion
//#region src/whatsapp/resolve-outbound-target.ts
function resolveWhatsAppOutboundTarget(params) {
	const trimmed = params.to?.trim() ?? "";
	const allowListRaw = (params.allowFrom ?? []).map((entry) => String(entry).trim()).filter(Boolean);
	const hasWildcard = allowListRaw.includes("*");
	const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeWhatsAppTarget(entry)).filter((entry) => Boolean(entry));
	if (trimmed) {
		const normalizedTo = normalizeWhatsAppTarget(trimmed);
		if (!normalizedTo) return {
			ok: false,
			error: missingTargetError("WhatsApp", "<E.164|group JID>")
		};
		if (isWhatsAppGroupJid(normalizedTo)) return {
			ok: true,
			to: normalizedTo
		};
		if (hasWildcard || allowList.length === 0) return {
			ok: true,
			to: normalizedTo
		};
		if (allowList.includes(normalizedTo)) return {
			ok: true,
			to: normalizedTo
		};
		return {
			ok: false,
			error: missingTargetError("WhatsApp", "<E.164|group JID>")
		};
	}
	return {
		ok: false,
		error: missingTargetError("WhatsApp", "<E.164|group JID>")
	};
}
//#endregion
//#region src/channels/plugins/whatsapp-shared.ts
const WHATSAPP_GROUP_INTRO_HINT = "WhatsApp IDs: SenderId is the participant JID (group participant id).";
function resolveWhatsAppGroupIntroHint() {
	return WHATSAPP_GROUP_INTRO_HINT;
}
function resolveWhatsAppMentionStripRegexes(ctx) {
	const selfE164 = (ctx.To ?? "").replace(/^whatsapp:/, "");
	if (!selfE164) return [];
	const escaped = escapeRegExp(selfE164);
	return [new RegExp(escaped, "g"), new RegExp(`@${escaped}`, "g")];
}
function createWhatsAppOutboundBase({ chunker, sendMessageWhatsApp, sendPollWhatsApp, shouldLogVerbose, resolveTarget = ({ to, allowFrom, mode }) => resolveWhatsAppOutboundTarget({
	to,
	allowFrom,
	mode
}), normalizeText = (text) => text ?? "", skipEmptyText = false }) {
	return {
		deliveryMode: "gateway",
		chunker,
		chunkerMode: "text",
		textChunkLimit: 4e3,
		pollMaxOptions: 12,
		resolveTarget,
		sendText: async ({ cfg, to, text, accountId, deps, gifPlayback }) => {
			const normalizedText = normalizeText(text);
			if (skipEmptyText && !normalizedText) return {
				channel: "whatsapp",
				messageId: ""
			};
			return {
				channel: "whatsapp",
				...await (resolveOutboundSendDep(deps, "whatsapp") ?? sendMessageWhatsApp)(to, normalizedText, {
					verbose: false,
					cfg,
					accountId: accountId ?? void 0,
					gifPlayback
				})
			};
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, accountId, deps, gifPlayback }) => {
			return {
				channel: "whatsapp",
				...await (resolveOutboundSendDep(deps, "whatsapp") ?? sendMessageWhatsApp)(to, normalizeText(text), {
					verbose: false,
					cfg,
					mediaUrl,
					mediaLocalRoots,
					accountId: accountId ?? void 0,
					gifPlayback
				})
			};
		},
		sendPoll: async ({ cfg, to, poll, accountId }) => await sendPollWhatsApp(to, poll, {
			verbose: shouldLogVerbose(),
			accountId: accountId ?? void 0,
			cfg
		})
	};
}
//#endregion
export { ambiguousTargetError as a, resolveOutboundSendDep as c, resolveWhatsAppOutboundTarget as i, resolveWhatsAppGroupRequireMention as l, resolveWhatsAppGroupIntroHint as n, missingTargetError as o, resolveWhatsAppMentionStripRegexes as r, unknownTargetError as s, createWhatsAppOutboundBase as t, resolveWhatsAppGroupToolPolicy as u };
