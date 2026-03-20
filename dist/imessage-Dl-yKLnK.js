import { Ja as looksLikeIMessageExplicitTargetId, Ka as normalizeIMessageMessagingTarget, Ua as resolveIMessageGroupRequireMention, Wa as resolveIMessageGroupToolPolicy, Xa as parseIMessageTarget, Ya as normalizeIMessageHandle, jp as collectStatusIssuesFromLastError, qa as inferIMessageTargetChatType, ro as resolveIMessageAccount } from "./auth-profiles-C1V2x6_A.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { l as formatTrimmedAllowFromEntries } from "./channel-config-helpers-DgtPbGwx.js";
import { d as buildOutboundBaseSessionKey, r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-0hYtqJ11.js";
import { t as buildAccountScopedAllowlistConfigEditor } from "./allowlist-config-edit-CJ5Dde-X.js";
import { n as buildPassiveProbedChannelStatusSummary } from "./channel-status-summary-CbgtDyC-.js";
import { n as setIMessageRuntime, t as getIMessageRuntime } from "./runtime-B1bFwvAB.js";
import { a as imessageSetupAdapter } from "./setup-core-ph_Fd6Rg.js";
import { i as imessageSetupWizard, n as createIMessagePluginBase, r as imessageResolveDmPolicy, t as collectIMessageSecurityWarnings } from "./shared-_ilJlvff.js";
//#region extensions/imessage/src/channel.ts
const loadIMessageChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-B4o_PiIK.js"));
function buildIMessageBaseSessionKey(params) {
	return buildOutboundBaseSessionKey({
		...params,
		channel: "imessage"
	});
}
function resolveIMessageOutboundSessionRoute(params) {
	const parsed = parseIMessageTarget(params.target);
	if (parsed.kind === "handle") {
		const handle = normalizeIMessageHandle(parsed.to);
		if (!handle) return null;
		const peer = {
			kind: "direct",
			id: handle
		};
		const baseSessionKey = buildIMessageBaseSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			accountId: params.accountId,
			peer
		});
		return {
			sessionKey: baseSessionKey,
			baseSessionKey,
			peer,
			chatType: "direct",
			from: `imessage:${handle}`,
			to: `imessage:${handle}`
		};
	}
	const peerId = parsed.kind === "chat_id" ? String(parsed.chatId) : parsed.kind === "chat_guid" ? parsed.chatGuid : parsed.chatIdentifier;
	if (!peerId) return null;
	const peer = {
		kind: "group",
		id: peerId
	};
	const baseSessionKey = buildIMessageBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	const toPrefix = parsed.kind === "chat_id" ? "chat_id" : parsed.kind === "chat_guid" ? "chat_guid" : "chat_identifier";
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		peer,
		chatType: "group",
		from: `imessage:group:${peerId}`,
		to: `${toPrefix}:${peerId}`
	};
}
const imessagePlugin = {
	...createIMessagePluginBase({
		setupWizard: imessageSetupWizard,
		setup: imessageSetupAdapter
	}),
	pairing: {
		idLabel: "imessageSenderId",
		notifyApproval: async ({ id }) => await (await loadIMessageChannelRuntime()).notifyIMessageApproval(id)
	},
	allowlist: {
		supportsScope: ({ scope }) => scope === "dm" || scope === "group" || scope === "all",
		readConfig: ({ cfg, accountId }) => {
			const account = resolveIMessageAccount({
				cfg,
				accountId
			});
			return {
				dmAllowFrom: (account.config.allowFrom ?? []).map(String),
				groupAllowFrom: (account.config.groupAllowFrom ?? []).map(String),
				dmPolicy: account.config.dmPolicy,
				groupPolicy: account.config.groupPolicy
			};
		},
		applyConfigEdit: buildAccountScopedAllowlistConfigEditor({
			channelId: "imessage",
			normalize: ({ values }) => formatTrimmedAllowFromEntries(values),
			resolvePaths: (scope) => ({
				readPaths: [[scope === "dm" ? "allowFrom" : "groupAllowFrom"]],
				writePath: [scope === "dm" ? "allowFrom" : "groupAllowFrom"]
			})
		})
	},
	security: {
		resolveDmPolicy: imessageResolveDmPolicy,
		collectWarnings: collectIMessageSecurityWarnings
	},
	groups: {
		resolveRequireMention: resolveIMessageGroupRequireMention,
		resolveToolPolicy: resolveIMessageGroupToolPolicy
	},
	messaging: {
		normalizeTarget: normalizeIMessageMessagingTarget,
		inferTargetChatType: ({ to }) => inferIMessageTargetChatType(to),
		resolveOutboundSessionRoute: (params) => resolveIMessageOutboundSessionRoute(params),
		targetResolver: {
			looksLikeId: looksLikeIMessageExplicitTargetId,
			hint: "<handle|chat_id:ID>",
			resolveTarget: async ({ normalized }) => {
				const to = normalized?.trim();
				if (!to) return null;
				const chatType = inferIMessageTargetChatType(to);
				if (!chatType) return null;
				return {
					to,
					kind: chatType === "direct" ? "user" : "group",
					source: "normalized"
				};
			}
		}
	},
	outbound: {
		deliveryMode: "direct",
		chunker: (text, limit) => getIMessageRuntime().channel.text.chunkText(text, limit),
		chunkerMode: "text",
		textChunkLimit: 4e3,
		sendText: async ({ cfg, to, text, accountId, deps, replyToId }) => {
			return {
				channel: "imessage",
				...await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
					cfg,
					to,
					text,
					accountId: accountId ?? void 0,
					deps,
					replyToId: replyToId ?? void 0
				})
			};
		},
		sendMedia: async ({ cfg, to, text, mediaUrl, mediaLocalRoots, accountId, deps, replyToId }) => {
			return {
				channel: "imessage",
				...await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
					cfg,
					to,
					text,
					mediaUrl,
					mediaLocalRoots,
					accountId: accountId ?? void 0,
					deps,
					replyToId: replyToId ?? void 0
				})
			};
		}
	},
	status: {
		defaultRuntime: {
			accountId: DEFAULT_ACCOUNT_ID,
			running: false,
			lastStartAt: null,
			lastStopAt: null,
			lastError: null,
			cliPath: null,
			dbPath: null
		},
		collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("imessage", accounts),
		buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
			cliPath: snapshot.cliPath ?? null,
			dbPath: snapshot.dbPath ?? null
		}),
		probeAccount: async ({ timeoutMs }) => await (await loadIMessageChannelRuntime()).probeIMessageAccount(timeoutMs),
		buildAccountSnapshot: ({ account, runtime, probe }) => ({
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: account.configured,
			running: runtime?.running ?? false,
			lastStartAt: runtime?.lastStartAt ?? null,
			lastStopAt: runtime?.lastStopAt ?? null,
			lastError: runtime?.lastError ?? null,
			cliPath: runtime?.cliPath ?? account.config.cliPath ?? null,
			dbPath: runtime?.dbPath ?? account.config.dbPath ?? null,
			probe,
			lastInboundAt: runtime?.lastInboundAt ?? null,
			lastOutboundAt: runtime?.lastOutboundAt ?? null
		}),
		resolveAccountState: ({ enabled }) => enabled ? "enabled" : "disabled"
	},
	gateway: { startAccount: async (ctx) => await (await loadIMessageChannelRuntime()).startIMessageGatewayAccount(ctx) }
};
//#endregion
//#region extensions/imessage/index.ts
var imessage_default = defineChannelPluginEntry({
	id: "imessage",
	name: "iMessage",
	description: "iMessage channel plugin",
	plugin: imessagePlugin,
	setRuntime: setIMessageRuntime
});
//#endregion
export { imessagePlugin as n, imessage_default as t };
