import { Mp as createDefaultChannelRuntimeState, jp as collectStatusIssuesFromLastError } from "./auth-profiles-BwxmeQoE.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BuyZMNja.js";
import { r as buildChannelConfigSchema } from "./config-schema-DxpGRv8-.js";
import { n as formatPairingApproveHint } from "./helpers-BkrbtWih.js";
import { o as createScopedDmSecurityResolver, s as createTopLevelChannelConfigAdapter } from "./channel-config-helpers-BRtPQkQ4.js";
import { o as stripChannelTargetPrefix, t as buildChannelOutboundSessionRoute } from "./core-DczSNd0Z.js";
import { a as resolveNostrAccount, c as getNostrRuntime, d as NostrConfigSchema, i as resolveDefaultNostrAccountId, n as nostrSetupWizard, o as normalizePubkey, r as listNostrAccountIds, s as startNostrBus, t as nostrSetupAdapter } from "./nostr-CwS-_9nF.js";
import { r as buildTrafficStatusSummary, t as buildPassiveChannelStatusSummary } from "./channel-status-summary-RzTrM4E-.js";
//#region extensions/nostr/src/session-route.ts
function resolveNostrOutboundSessionRoute(params) {
	const target = stripChannelTargetPrefix(params.target, "nostr");
	if (!target) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "nostr",
		accountId: params.accountId,
		peer: {
			kind: "direct",
			id: target
		},
		chatType: "direct",
		from: `nostr:${target}`,
		to: `nostr:${target}`
	});
}
//#endregion
//#region extensions/nostr/src/channel.ts
const activeBuses = /* @__PURE__ */ new Map();
const metricsSnapshots = /* @__PURE__ */ new Map();
const resolveNostrDmPolicy = createScopedDmSecurityResolver({
	channelKey: "nostr",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	defaultPolicy: "pairing",
	approveHint: formatPairingApproveHint("nostr"),
	normalizeEntry: (raw) => {
		try {
			return normalizePubkey(raw.replace(/^nostr:/i, "").trim());
		} catch {
			return raw.trim();
		}
	}
});
const nostrConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "nostr",
	resolveAccount: (cfg) => resolveNostrAccount({ cfg }),
	listAccountIds: listNostrAccountIds,
	defaultAccountId: resolveDefaultNostrAccountId,
	deleteMode: "clear-fields",
	clearBaseFields: [
		"name",
		"defaultAccount",
		"privateKey",
		"relays",
		"dmPolicy",
		"allowFrom",
		"profile"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => {
		if (entry === "*") return "*";
		try {
			return normalizePubkey(entry);
		} catch {
			return entry;
		}
	}).filter(Boolean)
});
const nostrPlugin = {
	id: "nostr",
	meta: {
		id: "nostr",
		label: "Nostr",
		selectionLabel: "Nostr",
		docsPath: "/channels/nostr",
		docsLabel: "nostr",
		blurb: "Decentralized DMs via Nostr relays (NIP-04)",
		order: 100
	},
	capabilities: {
		chatTypes: ["direct"],
		media: false
	},
	reload: { configPrefixes: ["channels.nostr"] },
	configSchema: buildChannelConfigSchema(NostrConfigSchema),
	setup: nostrSetupAdapter,
	setupWizard: nostrSetupWizard,
	config: {
		...nostrConfigAdapter,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => ({
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: account.configured,
			publicKey: account.publicKey
		})
	},
	pairing: {
		idLabel: "nostrPubkey",
		normalizeAllowEntry: (entry) => {
			try {
				return normalizePubkey(entry.replace(/^nostr:/i, ""));
			} catch {
				return entry;
			}
		},
		notifyApproval: async ({ id }) => {
			const bus = activeBuses.get(DEFAULT_ACCOUNT_ID);
			if (bus) await bus.sendDm(id, "Your pairing request has been approved!");
		}
	},
	security: { resolveDmPolicy: resolveNostrDmPolicy },
	messaging: {
		normalizeTarget: (target) => {
			const cleaned = target.replace(/^nostr:/i, "").trim();
			try {
				return normalizePubkey(cleaned);
			} catch {
				return cleaned;
			}
		},
		targetResolver: {
			looksLikeId: (input) => {
				const trimmed = input.trim();
				return trimmed.startsWith("npub1") || /^[0-9a-fA-F]{64}$/.test(trimmed);
			},
			hint: "<npub|hex pubkey|nostr:npub...>"
		},
		resolveOutboundSessionRoute: (params) => resolveNostrOutboundSessionRoute(params)
	},
	outbound: {
		deliveryMode: "direct",
		textChunkLimit: 4e3,
		sendText: async ({ cfg, to, text, accountId }) => {
			const core = getNostrRuntime();
			const aid = accountId ?? "default";
			const bus = activeBuses.get(aid);
			if (!bus) throw new Error(`Nostr bus not running for account ${aid}`);
			const tableMode = core.channel.text.resolveMarkdownTableMode({
				cfg,
				channel: "nostr",
				accountId: aid
			});
			const message = core.channel.text.convertMarkdownTables(text ?? "", tableMode);
			const normalizedTo = normalizePubkey(to);
			await bus.sendDm(normalizedTo, message);
			return {
				channel: "nostr",
				to: normalizedTo,
				messageId: `nostr-${Date.now()}`
			};
		}
	},
	status: {
		defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
		collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("nostr", accounts),
		buildChannelSummary: ({ snapshot }) => buildPassiveChannelStatusSummary(snapshot, { publicKey: snapshot.publicKey ?? null }),
		buildAccountSnapshot: ({ account, runtime }) => ({
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: account.configured,
			publicKey: account.publicKey,
			profile: account.profile,
			running: runtime?.running ?? false,
			lastStartAt: runtime?.lastStartAt ?? null,
			lastStopAt: runtime?.lastStopAt ?? null,
			lastError: runtime?.lastError ?? null,
			...buildTrafficStatusSummary(runtime)
		})
	},
	gateway: { startAccount: async (ctx) => {
		const account = ctx.account;
		ctx.setStatus({
			accountId: account.accountId,
			publicKey: account.publicKey
		});
		ctx.log?.info(`[${account.accountId}] starting Nostr provider (pubkey: ${account.publicKey})`);
		if (!account.configured) throw new Error("Nostr private key not configured");
		const runtime = getNostrRuntime();
		let busHandle = null;
		const bus = await startNostrBus({
			accountId: account.accountId,
			privateKey: account.privateKey,
			relays: account.relays,
			onMessage: async (senderPubkey, text, reply) => {
				ctx.log?.debug?.(`[${account.accountId}] DM from ${senderPubkey}: ${text.slice(0, 50)}...`);
				await runtime.channel.reply.handleInboundMessage?.({
					channel: "nostr",
					accountId: account.accountId,
					senderId: senderPubkey,
					chatType: "direct",
					chatId: senderPubkey,
					text,
					reply: async (responseText) => {
						await reply(responseText);
					}
				});
			},
			onError: (error, context) => {
				ctx.log?.error?.(`[${account.accountId}] Nostr error (${context}): ${error.message}`);
			},
			onConnect: (relay) => {
				ctx.log?.debug?.(`[${account.accountId}] Connected to relay: ${relay}`);
			},
			onDisconnect: (relay) => {
				ctx.log?.debug?.(`[${account.accountId}] Disconnected from relay: ${relay}`);
			},
			onEose: (relays) => {
				ctx.log?.debug?.(`[${account.accountId}] EOSE received from relays: ${relays}`);
			},
			onMetric: (event) => {
				if (event.name.startsWith("event.rejected.")) ctx.log?.debug?.(`[${account.accountId}] Metric: ${event.name} ${JSON.stringify(event.labels)}`);
				else if (event.name === "relay.circuit_breaker.open") ctx.log?.warn?.(`[${account.accountId}] Circuit breaker opened for relay: ${event.labels?.relay}`);
				else if (event.name === "relay.circuit_breaker.close") ctx.log?.info?.(`[${account.accountId}] Circuit breaker closed for relay: ${event.labels?.relay}`);
				else if (event.name === "relay.error") ctx.log?.debug?.(`[${account.accountId}] Relay error: ${event.labels?.relay}`);
				if (busHandle) metricsSnapshots.set(account.accountId, busHandle.getMetrics());
			}
		});
		busHandle = bus;
		activeBuses.set(account.accountId, bus);
		ctx.log?.info(`[${account.accountId}] Nostr provider started, connected to ${account.relays.length} relay(s)`);
		return { stop: () => {
			bus.close();
			activeBuses.delete(account.accountId);
			metricsSnapshots.delete(account.accountId);
			ctx.log?.info(`[${account.accountId}] Nostr provider stopped`);
		} };
	} }
};
/**
* Publish a profile (kind:0) for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @param profile - Profile data to publish
* @returns Publish results with successes and failures
* @throws Error if account is not running
*/
async function publishNostrProfile(accountId = DEFAULT_ACCOUNT_ID, profile) {
	const bus = activeBuses.get(accountId);
	if (!bus) throw new Error(`Nostr bus not running for account ${accountId}`);
	return bus.publishProfile(profile);
}
/**
* Get profile publish state for a Nostr account.
* @param accountId - Account ID (defaults to "default")
* @returns Profile publish state or null if account not running
*/
async function getNostrProfileState(accountId = DEFAULT_ACCOUNT_ID) {
	const bus = activeBuses.get(accountId);
	if (!bus) return null;
	return bus.getProfileState();
}
//#endregion
export { nostrPlugin as n, publishNostrProfile as r, getNostrProfileState as t };
