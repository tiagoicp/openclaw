import { Mp as createDefaultChannelRuntimeState, Op as buildProbeChannelStatusSummary, kp as buildRuntimeAccountStatusSnapshot, qt as createMessageToolCardSchema } from "./auth-profiles-C1V2x6_A.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B0Ci-_gE.js";
import { o as MSTeamsConfigSchema } from "./zod-schema.providers-core-JSZEvSLs.js";
import { r as buildChannelConfigSchema } from "./config-schema-SbU9iMOP.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./channel-plugin-common-lL08nJSM.js";
import { a as collectAllowlistProviderRestrictSendersWarnings } from "./group-policy-warnings-BpL6kBOR.js";
import { s as createTopLevelChannelConfigAdapter } from "./channel-config-helpers-DgtPbGwx.js";
import { o as stripChannelTargetPrefix, s as stripTargetKindPrefix, t as buildChannelOutboundSessionRoute } from "./core-DoWJeX1b.js";
import { i as createLazyRuntimeNamedExport } from "./lazy-runtime-0hYtqJ11.js";
import { t as formatAllowFromLowercase } from "./allow-from-DoBojQVl.js";
import { P as msteamsSetupAdapter, a as parseMSTeamsTeamChannelInput, i as parseMSTeamsConversationId, n as normalizeMSTeamsMessagingTarget, o as resolveMSTeamsChannelAllowlist, p as resolveMSTeamsCredentials, r as normalizeMSTeamsUserInput, s as resolveMSTeamsUserAllowlist, t as msteamsSetupWizard } from "./msteams-C0zC1l4q.js";
import { r as resolveMSTeamsGroupToolPolicy } from "./policy-DCkhk3yX.js";
import { t as getMSTeamsRuntime } from "./runtime-B9b0rJIT.js";
//#region extensions/msteams/src/session-route.ts
function resolveMSTeamsOutboundSessionRoute(params) {
	let trimmed = stripChannelTargetPrefix(params.target, "msteams", "teams");
	if (!trimmed) return null;
	const isUser = trimmed.toLowerCase().startsWith("user:");
	const rawId = stripTargetKindPrefix(trimmed);
	if (!rawId) return null;
	const conversationId = rawId.split(";")[0] ?? rawId;
	const isChannel = !isUser && /@thread\.tacv2/i.test(conversationId);
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		peer: {
			kind: isUser ? "direct" : isChannel ? "channel" : "group",
			id: conversationId
		},
		chatType: isUser ? "direct" : isChannel ? "channel" : "group",
		from: isUser ? `msteams:${conversationId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`,
		to: isUser ? `user:${conversationId}` : `conversation:${conversationId}`
	});
}
//#endregion
//#region extensions/msteams/src/channel.ts
const meta = {
	id: "msteams",
	label: "Microsoft Teams",
	selectionLabel: "Microsoft Teams (Bot Framework)",
	docsPath: "/channels/msteams",
	docsLabel: "msteams",
	blurb: "Bot Framework; enterprise support.",
	aliases: ["teams"],
	order: 60
};
const TEAMS_GRAPH_PERMISSION_HINTS = {
	"ChannelMessage.Read.All": "channel history",
	"Chat.Read.All": "chat history",
	"Channel.ReadBasic.All": "channel list",
	"Team.ReadBasic.All": "team list",
	"TeamsActivity.Read.All": "teams activity",
	"Sites.Read.All": "files (SharePoint)",
	"Files.Read.All": "files (OneDrive)"
};
const loadMSTeamsChannelRuntime = createLazyRuntimeNamedExport(() => import("./channel.runtime-Bo2rFtm9.js"), "msTeamsChannelRuntime");
const resolveMSTeamsChannelConfig = (cfg) => ({
	allowFrom: cfg.channels?.msteams?.allowFrom,
	defaultTo: cfg.channels?.msteams?.defaultTo
});
const msteamsConfigAdapter = createTopLevelChannelConfigAdapter({
	sectionKey: "msteams",
	resolveAccount: (cfg) => ({
		accountId: DEFAULT_ACCOUNT_ID,
		enabled: cfg.channels?.msteams?.enabled !== false,
		configured: Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams))
	}),
	resolveAccessorAccount: ({ cfg }) => resolveMSTeamsChannelConfig(cfg),
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
function describeMSTeamsMessageTool({ cfg }) {
	const enabled = cfg.channels?.msteams?.enabled !== false && Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams));
	return {
		actions: enabled ? ["poll"] : [],
		capabilities: enabled ? ["cards"] : [],
		schema: enabled ? { properties: { card: createMessageToolCardSchema() } } : null
	};
}
const msteamsPlugin = {
	id: "msteams",
	meta: {
		...meta,
		aliases: [...meta.aliases]
	},
	setupWizard: msteamsSetupWizard,
	pairing: {
		idLabel: "msteamsUserId",
		normalizeAllowEntry: (entry) => entry.replace(/^(msteams|user):/i, ""),
		notifyApproval: async ({ cfg, id }) => {
			const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
			await sendMessageMSTeams({
				cfg,
				to: id,
				text: PAIRING_APPROVED_MESSAGE
			});
		}
	},
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"thread"
		],
		polls: true,
		threads: true,
		media: true
	},
	agentPrompt: { messageToolHints: () => ["- Adaptive Cards supported. Use `action=send` with `card={type,version,body}` to send rich cards.", "- MSTeams targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:ID` or `user:Display Name` (requires Graph API) for DMs, `conversation:19:...@thread.tacv2` for groups/channels. Prefer IDs over display names for speed."] },
	threading: { buildToolContext: ({ context, hasRepliedRef }) => ({
		currentChannelId: context.To?.trim() || void 0,
		currentThreadTs: context.ReplyToId,
		hasRepliedRef
	}) },
	groups: { resolveToolPolicy: resolveMSTeamsGroupToolPolicy },
	reload: { configPrefixes: ["channels.msteams"] },
	configSchema: buildChannelConfigSchema(MSTeamsConfigSchema),
	config: {
		...msteamsConfigAdapter,
		isConfigured: (_account, cfg) => Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams)),
		describeAccount: (account) => ({
			accountId: account.accountId,
			enabled: account.enabled,
			configured: account.configured
		})
	},
	security: { collectWarnings: ({ cfg }) => {
		return collectAllowlistProviderRestrictSendersWarnings({
			cfg,
			providerConfigPresent: cfg.channels?.msteams !== void 0,
			configuredGroupPolicy: cfg.channels?.msteams?.groupPolicy,
			surface: "MS Teams groups",
			openScope: "any member",
			groupPolicyPath: "channels.msteams.groupPolicy",
			groupAllowFromPath: "channels.msteams.groupAllowFrom"
		});
	} },
	setup: msteamsSetupAdapter,
	messaging: {
		normalizeTarget: normalizeMSTeamsMessagingTarget,
		resolveOutboundSessionRoute: (params) => resolveMSTeamsOutboundSessionRoute(params),
		targetResolver: {
			looksLikeId: (raw) => {
				const trimmed = raw.trim();
				if (!trimmed) return false;
				if (/^conversation:/i.test(trimmed)) return true;
				if (/^user:/i.test(trimmed)) {
					const id = trimmed.slice(5).trim();
					return /^[0-9a-fA-F-]{16,}$/.test(id);
				}
				return trimmed.includes("@thread");
			},
			hint: "<conversationId|user:ID|conversation:ID>"
		}
	},
	directory: {
		self: async () => null,
		listPeers: async ({ cfg, query, limit }) => {
			const q = query?.trim().toLowerCase() || "";
			const ids = /* @__PURE__ */ new Set();
			for (const entry of cfg.channels?.msteams?.allowFrom ?? []) {
				const trimmed = String(entry).trim();
				if (trimmed && trimmed !== "*") ids.add(trimmed);
			}
			for (const userId of Object.keys(cfg.channels?.msteams?.dms ?? {})) {
				const trimmed = userId.trim();
				if (trimmed) ids.add(trimmed);
			}
			return Array.from(ids).map((raw) => raw.trim()).filter(Boolean).map((raw) => normalizeMSTeamsMessagingTarget(raw) ?? raw).map((raw) => {
				const lowered = raw.toLowerCase();
				if (lowered.startsWith("user:")) return raw;
				if (lowered.startsWith("conversation:")) return raw;
				return `user:${raw}`;
			}).filter((id) => q ? id.toLowerCase().includes(q) : true).slice(0, limit && limit > 0 ? limit : void 0).map((id) => ({
				kind: "user",
				id
			}));
		},
		listGroups: async ({ cfg, query, limit }) => {
			const q = query?.trim().toLowerCase() || "";
			const ids = /* @__PURE__ */ new Set();
			for (const team of Object.values(cfg.channels?.msteams?.teams ?? {})) for (const channelId of Object.keys(team.channels ?? {})) {
				const trimmed = channelId.trim();
				if (trimmed && trimmed !== "*") ids.add(trimmed);
			}
			return Array.from(ids).map((raw) => raw.trim()).filter(Boolean).map((raw) => raw.replace(/^conversation:/i, "").trim()).map((id) => `conversation:${id}`).filter((id) => q ? id.toLowerCase().includes(q) : true).slice(0, limit && limit > 0 ? limit : void 0).map((id) => ({
				kind: "group",
				id
			}));
		},
		listPeersLive: async ({ cfg, query, limit }) => (await loadMSTeamsChannelRuntime()).listMSTeamsDirectoryPeersLive({
			cfg,
			query,
			limit
		}),
		listGroupsLive: async ({ cfg, query, limit }) => (await loadMSTeamsChannelRuntime()).listMSTeamsDirectoryGroupsLive({
			cfg,
			query,
			limit
		})
	},
	resolver: { resolveTargets: async ({ cfg, inputs, kind, runtime }) => {
		const results = inputs.map((input) => ({
			input,
			resolved: false,
			id: void 0,
			name: void 0,
			note: void 0
		}));
		const stripPrefix = (value) => normalizeMSTeamsUserInput(value);
		const markPendingLookupFailed = (pending) => {
			pending.forEach(({ index }) => {
				const entry = results[index];
				if (entry) entry.note = "lookup failed";
			});
		};
		const resolvePending = async (pending, resolveEntries, applyResolvedEntry) => {
			if (pending.length === 0) return;
			try {
				(await resolveEntries(pending.map((entry) => entry.query))).forEach((entry, idx) => {
					const target = results[pending[idx]?.index ?? -1];
					if (!target) return;
					applyResolvedEntry(target, entry);
				});
			} catch (err) {
				runtime.error?.(`msteams resolve failed: ${String(err)}`);
				markPendingLookupFailed(pending);
			}
		};
		if (kind === "user") {
			const pending = [];
			results.forEach((entry, index) => {
				const trimmed = entry.input.trim();
				if (!trimmed) {
					entry.note = "empty input";
					return;
				}
				const cleaned = stripPrefix(trimmed);
				if (/^[0-9a-fA-F-]{16,}$/.test(cleaned) || cleaned.includes("@")) {
					entry.resolved = true;
					entry.id = cleaned;
					return;
				}
				pending.push({
					input: entry.input,
					query: cleaned,
					index
				});
			});
			await resolvePending(pending, (entries) => resolveMSTeamsUserAllowlist({
				cfg,
				entries
			}), (target, entry) => {
				target.resolved = entry.resolved;
				target.id = entry.id;
				target.name = entry.name;
				target.note = entry.note;
			});
			return results;
		}
		const pending = [];
		results.forEach((entry, index) => {
			const trimmed = entry.input.trim();
			if (!trimmed) {
				entry.note = "empty input";
				return;
			}
			const conversationId = parseMSTeamsConversationId(trimmed);
			if (conversationId !== null) {
				entry.resolved = Boolean(conversationId);
				entry.id = conversationId || void 0;
				entry.note = conversationId ? "conversation id" : "empty conversation id";
				return;
			}
			const parsed = parseMSTeamsTeamChannelInput(trimmed);
			if (!parsed.team) {
				entry.note = "missing team";
				return;
			}
			const query = parsed.channel ? `${parsed.team}/${parsed.channel}` : parsed.team;
			pending.push({
				input: entry.input,
				query,
				index
			});
		});
		await resolvePending(pending, (entries) => resolveMSTeamsChannelAllowlist({
			cfg,
			entries
		}), (target, entry) => {
			if (!entry.resolved || !entry.teamId) {
				target.resolved = false;
				target.note = entry.note;
				return;
			}
			target.resolved = true;
			if (entry.channelId) {
				target.id = `${entry.teamId}/${entry.channelId}`;
				target.name = entry.channelName && entry.teamName ? `${entry.teamName}/${entry.channelName}` : entry.channelName ?? entry.teamName;
			} else {
				target.id = entry.teamId;
				target.name = entry.teamName;
				target.note = "team id";
			}
			if (entry.note) target.note = entry.note;
		});
		return results;
	} },
	actions: {
		describeMessageTool: describeMSTeamsMessageTool,
		handleAction: async (ctx) => {
			if (ctx.action === "send" && ctx.params.card) {
				const card = ctx.params.card;
				const to = typeof ctx.params.to === "string" ? ctx.params.to.trim() : typeof ctx.params.target === "string" ? ctx.params.target.trim() : "";
				if (!to) return {
					isError: true,
					content: [{
						type: "text",
						text: "Card send requires a target (to)."
					}],
					details: { error: "Card send requires a target (to)." }
				};
				const { sendAdaptiveCardMSTeams } = await loadMSTeamsChannelRuntime();
				const result = await sendAdaptiveCardMSTeams({
					cfg: ctx.cfg,
					to,
					card
				});
				return {
					content: [{
						type: "text",
						text: JSON.stringify({
							ok: true,
							channel: "msteams",
							messageId: result.messageId,
							conversationId: result.conversationId
						})
					}],
					details: {
						ok: true,
						channel: "msteams",
						messageId: result.messageId
					}
				};
			}
			return null;
		}
	},
	outbound: {
		deliveryMode: "direct",
		chunker: (text, limit) => getMSTeamsRuntime().channel.text.chunkMarkdownText(text, limit),
		chunkerMode: "markdown",
		textChunkLimit: 4e3,
		pollMaxOptions: 12,
		sendText: async (params) => (await loadMSTeamsChannelRuntime()).msteamsOutbound.sendText(params),
		sendMedia: async (params) => (await loadMSTeamsChannelRuntime()).msteamsOutbound.sendMedia(params),
		sendPoll: async (params) => (await loadMSTeamsChannelRuntime()).msteamsOutbound.sendPoll(params)
	},
	status: {
		defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, { port: null }),
		buildChannelSummary: ({ snapshot }) => buildProbeChannelStatusSummary(snapshot, { port: snapshot.port ?? null }),
		probeAccount: async ({ cfg }) => await (await loadMSTeamsChannelRuntime()).probeMSTeams(cfg.channels?.msteams),
		formatCapabilitiesProbe: ({ probe }) => {
			const teamsProbe = probe;
			const lines = [];
			const appId = typeof teamsProbe?.appId === "string" ? teamsProbe.appId.trim() : "";
			if (appId) lines.push({ text: `App: ${appId}` });
			const graph = teamsProbe?.graph;
			if (graph) {
				const roles = Array.isArray(graph.roles) ? graph.roles.map((role) => String(role).trim()).filter(Boolean) : [];
				const scopes = Array.isArray(graph.scopes) ? graph.scopes.map((scope) => String(scope).trim()).filter(Boolean) : [];
				const formatPermission = (permission) => {
					const hint = TEAMS_GRAPH_PERMISSION_HINTS[permission];
					return hint ? `${permission} (${hint})` : permission;
				};
				if (graph.ok === false) lines.push({
					text: `Graph: ${graph.error ?? "failed"}`,
					tone: "error"
				});
				else if (roles.length > 0 || scopes.length > 0) {
					if (roles.length > 0) lines.push({ text: `Graph roles: ${roles.map(formatPermission).join(", ")}` });
					if (scopes.length > 0) lines.push({ text: `Graph scopes: ${scopes.map(formatPermission).join(", ")}` });
				} else if (graph.ok === true) lines.push({ text: "Graph: ok" });
			}
			return lines;
		},
		buildAccountSnapshot: ({ account, runtime, probe }) => ({
			accountId: account.accountId,
			enabled: account.enabled,
			configured: account.configured,
			...buildRuntimeAccountStatusSnapshot({
				runtime,
				probe
			}),
			port: runtime?.port ?? null
		})
	},
	gateway: { startAccount: async (ctx) => {
		const { monitorMSTeamsProvider } = await import("./src-DGsPG5cU.js");
		const port = ctx.cfg.channels?.msteams?.webhook?.port ?? 3978;
		ctx.setStatus({
			accountId: ctx.accountId,
			port
		});
		ctx.log?.info(`starting provider (port ${port})`);
		return monitorMSTeamsProvider({
			cfg: ctx.cfg,
			runtime: ctx.runtime,
			abortSignal: ctx.abortSignal
		});
	} }
};
//#endregion
export { msteamsPlugin as t };
