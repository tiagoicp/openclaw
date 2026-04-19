import { a as resolveSlackAccount, i as resolveDefaultSlackAccountId, n as listSlackAccountIds, o as resolveSlackReplyToMode } from "./accounts-DJiceqJx.js";
import { i as resolveSlackChannelId, n as normalizeSlackMessagingTarget, r as parseSlackTarget, t as looksLikeSlackTargetId } from "./target-parsing-CQmv-iSm.js";
import "./targets-B1tYCAr6.js";
import { a as resolveSlackExecApprovalTarget, i as normalizeSlackApproverId, n as isSlackExecApprovalAuthorizedSender, o as shouldHandleSlackExecApprovalRequest, r as isSlackExecApprovalClientEnabled, s as shouldSuppressLocalSlackExecApprovalPrompt, t as getSlackExecApprovalApprovers } from "./exec-approvals-D4uUgK_Y.js";
import { n as parseSlackBlocksInput } from "./blocks-input-Cg5DzJsb.js";
import { r as buildSlackInteractiveBlocks } from "./blocks-render-CN6CtZWz.js";
import { n as extractSlackToolSend, t as describeSlackMessageTool } from "./message-tool-api-CcZA9bDp.js";
import { n as isSlackInteractiveRepliesEnabled, t as compileSlackInteractiveReplies } from "./interactive-replies-COOResM7.js";
import { a as resolveConfiguredFromRequiredCredentialStatuses, i as projectCredentialSnapshotFields, n as PAIRING_APPROVED_MESSAGE, t as DEFAULT_ACCOUNT_ID } from "./channel-api-B_nZwosg.js";
import { r as createSlackWebClient } from "./client-DfAuvcFw.js";
import { r as normalizeAllowListLower } from "./allow-list-DrqC25jf.js";
import { a as resolveSlackGroupToolPolicy, i as resolveSlackGroupRequireMention, n as getSlackRuntime, t as getOptionalSlackRuntime } from "./runtime-Dom3bHwR.js";
import { t as SLACK_TEXT_LIMIT } from "./limits-BmJsbgo5.js";
import { t as slackOutbound } from "./outbound-adapter-DxTgpQAt.js";
import { t as resolveSlackReplyBlocks } from "./reply-blocks-C5jks2j_.js";
import { t as collectSlackSecurityAuditFindings } from "./security-audit-CoTKBAQp.js";
import { a as isSlackPluginAccountConfigured, i as createSlackPluginBase, n as slackSetupAdapter, o as slackConfigAdapter, r as SLACK_CHANNEL, t as slackSetupWizard } from "./setup-surface-CPY95Wk5.js";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/text-runtime";
import { buildLegacyDmAccountAllowlistAdapter, createAccountScopedAllowlistNameResolver, createFlatAllowlistOverrideResolver } from "openclaw/plugin-sdk/allowlist-config-edit";
import { adaptScopedAccountAccessor, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createOpenProviderConfiguredRouteWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { createChannelDirectoryAdapter, createRuntimeDirectoryLiveAdapter } from "openclaw/plugin-sdk/directory-runtime";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolveOutboundSendDep } from "openclaw/plugin-sdk/outbound-runtime";
import { buildOutboundBaseSessionKey, normalizeOutboundThreadId, resolveThreadSessionKeys } from "openclaw/plugin-sdk/routing";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { resolveTargetsWithOptionalToken } from "openclaw/plugin-sdk/target-resolver-runtime";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { createApproverRestrictedNativeApprovalCapability, splitChannelApprovalCapability } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { createChannelApproverDmTargetResolver, createChannelNativeOriginTargetResolver, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { createResolvedApproverActionAuthAdapter, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { normalizeInteractiveReply } from "openclaw/plugin-sdk/interactive-runtime";
import { readNumberParam, readStringParam } from "openclaw/plugin-sdk/param-readers";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/slack/src/action-threading.ts
function resolveSlackAutoThreadId(params) {
	const context = params.toolContext;
	if (!context?.currentThreadTs || !context.currentChannelId) return;
	if (context.replyToMode !== "all" && !isSingleUseReplyToMode(context.replyToMode ?? "off")) return;
	const parsedTarget = parseSlackTarget(params.to, { defaultKind: "channel" });
	if (!parsedTarget || parsedTarget.kind !== "channel") return;
	if (normalizeLowercaseStringOrEmpty(parsedTarget.id) !== normalizeLowercaseStringOrEmpty(context.currentChannelId)) return;
	if (isSingleUseReplyToMode(context.replyToMode ?? "off") && context.hasRepliedRef?.value) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/slack/src/approval-auth.ts
function getSlackApprovalApprovers(params) {
	const account = resolveSlackAccount(params).config;
	return resolveApprovalApprovers({
		allowFrom: account.allowFrom,
		extraAllowFrom: account.dm?.allowFrom,
		defaultTo: account.defaultTo,
		normalizeApprover: normalizeSlackApproverId,
		normalizeDefaultTo: normalizeSlackApproverId
	});
}
function isSlackApprovalAuthorizedSender(params) {
	const senderId = params.senderId ? normalizeSlackApproverId(params.senderId) : void 0;
	if (!senderId) return false;
	return getSlackApprovalApprovers(params).includes(senderId);
}
createResolvedApproverActionAuthAdapter({
	channelLabel: "Slack",
	resolveApprovers: ({ cfg, accountId }) => getSlackApprovalApprovers({
		cfg,
		accountId
	}),
	normalizeSenderId: (value) => normalizeSlackApproverId(value)
});
//#endregion
//#region extensions/slack/src/approval-native.ts
function extractSlackSessionKind(sessionKey) {
	if (!sessionKey) return null;
	const kind = normalizeLowercaseStringOrEmpty(sessionKey.match(/slack:(direct|channel|group):/i)?.[1]);
	return kind ? kind : null;
}
function normalizeComparableTarget(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function normalizeSlackThreadMatchKey(threadId) {
	const trimmed = threadId?.trim();
	if (!trimmed) return "";
	return trimmed.match(/^\d+/)?.[0] ?? trimmed;
}
function resolveTurnSourceSlackOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const turnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	if (turnSourceChannel !== "slack" || !turnSourceTo) return null;
	const parsed = parseSlackTarget(turnSourceTo, { defaultKind: extractSlackSessionKind(request.request.sessionKey ?? void 0) === "direct" ? "user" : "channel" });
	if (!parsed) return null;
	const threadId = typeof request.request.turnSourceThreadId === "string" ? normalizeOptionalString(request.request.turnSourceThreadId) : typeof request.request.turnSourceThreadId === "number" ? String(request.request.turnSourceThreadId) : void 0;
	return {
		to: `${parsed.kind}:${parsed.id}`,
		threadId
	};
}
function resolveSessionSlackOriginTarget(sessionTarget) {
	return {
		to: sessionTarget.to,
		threadId: typeof sessionTarget.threadId === "string" ? normalizeOptionalString(sessionTarget.threadId) : typeof sessionTarget.threadId === "number" ? String(sessionTarget.threadId) : void 0
	};
}
function resolveSlackFallbackOriginTarget(request) {
	const sessionTarget = resolveApprovalRequestSessionConversation({
		request,
		channel: "slack",
		bundledFallback: false
	});
	if (!sessionTarget) return null;
	const parsed = parseSlackTarget(sessionTarget.id.toUpperCase(), { defaultKind: "channel" });
	if (!parsed) return null;
	return {
		to: `${parsed.kind}:${parsed.id}`,
		threadId: sessionTarget.threadId
	};
}
function slackTargetsMatch(a, b) {
	return normalizeComparableTarget(a.to) === normalizeComparableTarget(b.to) && normalizeSlackThreadMatchKey(a.threadId) === normalizeSlackThreadMatchKey(b.threadId);
}
const slackApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "slack",
	channelLabel: "Slack",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.slack.accounts.${accountId}` : "channels.slack";
		return `Approve it from the Web UI or terminal UI for now. Slack supports native exec approvals for this account. Configure \`${prefix}.execApprovals.approvers\` or \`commands.ownerAllowFrom\`; leave \`${prefix}.execApprovals.enabled\` unset/\`auto\` or set it to \`true\`.`;
	},
	listAccountIds: listSlackAccountIds,
	hasApprovers: ({ cfg, accountId }) => getSlackExecApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => isSlackExecApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => isSlackApprovalAuthorizedSender({
		cfg,
		accountId,
		senderId
	}),
	isNativeDeliveryEnabled: ({ cfg, accountId }) => isSlackExecApprovalClientEnabled({
		cfg,
		accountId
	}),
	resolveNativeDeliveryMode: ({ cfg, accountId }) => resolveSlackExecApprovalTarget({
		cfg,
		accountId
	}),
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: createChannelNativeOriginTargetResolver({
		channel: "slack",
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleSlackExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
		resolveSessionTarget: resolveSessionSlackOriginTarget,
		targetsMatch: slackTargetsMatch,
		resolveFallbackTarget: resolveSlackFallbackOriginTarget
	}),
	resolveApproverDmTargets: createChannelApproverDmTargetResolver({
		shouldHandleRequest: ({ cfg, accountId, request }) => shouldHandleSlackExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		resolveApprovers: getSlackExecApprovalApprovers,
		mapApprover: (approver) => ({ to: `user:${approver}` })
	}),
	notifyOriginWhenDmOnly: true,
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec"],
		isConfigured: ({ cfg, accountId }) => isSlackExecApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, request }) => shouldHandleSlackExecApprovalRequest({
			cfg,
			accountId,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-DHaYWAv0.js")).slackApprovalNativeRuntime
	})
});
splitChannelApprovalCapability(slackApprovalCapability);
//#endregion
//#region extensions/slack/src/message-action-dispatch.ts
function readSlackBlocksParam(actionParams) {
	return parseSlackBlocksInput(actionParams.blocks);
}
/** Translate generic channel action requests into Slack-specific tool invocations and payload shapes. */
async function handleSlackMessageAction(params) {
	const { providerId, ctx, invoke, normalizeChannelId, includeReadThreadId = false } = params;
	const { action, cfg, params: actionParams } = ctx;
	const accountId = ctx.accountId ?? void 0;
	const resolveChannelId = () => {
		const channelId = readStringParam(actionParams, "channelId") ?? readStringParam(actionParams, "to", { required: true });
		return normalizeChannelId ? normalizeChannelId(channelId) : channelId;
	};
	if (action === "send") {
		const to = readStringParam(actionParams, "to", { required: true });
		const content = readStringParam(actionParams, "message", {
			required: false,
			allowEmpty: true
		});
		const mediaUrl = readStringParam(actionParams, "media", { trim: false });
		const interactive = normalizeInteractiveReply(actionParams.interactive);
		const interactiveBlocks = interactive ? buildSlackInteractiveBlocks(interactive) : void 0;
		const blocks = readSlackBlocksParam(actionParams) ?? interactiveBlocks;
		if (!content && !mediaUrl && !blocks) throw new Error("Slack send requires message, blocks, or media.");
		if (mediaUrl && blocks) throw new Error("Slack send does not support blocks with media.");
		const threadId = readStringParam(actionParams, "threadId");
		const replyTo = readStringParam(actionParams, "replyTo");
		return await invoke({
			action: "sendMessage",
			to,
			content: content ?? "",
			mediaUrl: mediaUrl ?? void 0,
			accountId,
			threadTs: threadId ?? replyTo ?? void 0,
			...blocks ? { blocks } : {}
		}, cfg, ctx.toolContext);
	}
	if (action === "react") {
		const messageId = readStringParam(actionParams, "messageId", { required: true });
		const emoji = readStringParam(actionParams, "emoji", { allowEmpty: true });
		const remove = typeof actionParams.remove === "boolean" ? actionParams.remove : void 0;
		return await invoke({
			action: "react",
			channelId: resolveChannelId(),
			messageId,
			emoji,
			remove,
			accountId
		}, cfg);
	}
	if (action === "reactions") {
		const messageId = readStringParam(actionParams, "messageId", { required: true });
		const limit = readNumberParam(actionParams, "limit", { integer: true });
		return await invoke({
			action: "reactions",
			channelId: resolveChannelId(),
			messageId,
			limit,
			accountId
		}, cfg);
	}
	if (action === "read") {
		const limit = readNumberParam(actionParams, "limit", { integer: true });
		const readAction = {
			action: "readMessages",
			channelId: resolveChannelId(),
			limit,
			before: readStringParam(actionParams, "before"),
			after: readStringParam(actionParams, "after"),
			accountId
		};
		if (includeReadThreadId) readAction.threadId = readStringParam(actionParams, "threadId");
		return await invoke(readAction, cfg);
	}
	if (action === "edit") {
		const messageId = readStringParam(actionParams, "messageId", { required: true });
		const content = readStringParam(actionParams, "message", { allowEmpty: true });
		const blocks = readSlackBlocksParam(actionParams);
		if (!content && !blocks) throw new Error("Slack edit requires message or blocks.");
		return await invoke({
			action: "editMessage",
			channelId: resolveChannelId(),
			messageId,
			content: content ?? "",
			blocks,
			accountId
		}, cfg);
	}
	if (action === "delete") {
		const messageId = readStringParam(actionParams, "messageId", { required: true });
		return await invoke({
			action: "deleteMessage",
			channelId: resolveChannelId(),
			messageId,
			accountId
		}, cfg);
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const messageId = action === "list-pins" ? void 0 : readStringParam(actionParams, "messageId", { required: true });
		return await invoke({
			action: action === "pin" ? "pinMessage" : action === "unpin" ? "unpinMessage" : "listPins",
			channelId: resolveChannelId(),
			messageId,
			accountId
		}, cfg);
	}
	if (action === "member-info") return await invoke({
		action: "memberInfo",
		userId: readStringParam(actionParams, "userId", { required: true }),
		accountId
	}, cfg);
	if (action === "emoji-list") return await invoke({
		action: "emojiList",
		limit: readNumberParam(actionParams, "limit", { integer: true }),
		accountId
	}, cfg);
	if (action === "download-file") {
		const fileId = readStringParam(actionParams, "fileId", { required: true });
		const channelId = readStringParam(actionParams, "channelId") ?? readStringParam(actionParams, "to");
		const threadId = readStringParam(actionParams, "threadId") ?? readStringParam(actionParams, "replyTo");
		return await invoke({
			action: "downloadFile",
			fileId,
			channelId: channelId ?? void 0,
			threadId: threadId ?? void 0,
			accountId
		}, cfg);
	}
	if (action === "upload-file") {
		const to = readStringParam(actionParams, "to") ?? resolveChannelId();
		const filePath = readStringParam(actionParams, "filePath", { trim: false }) ?? readStringParam(actionParams, "path", { trim: false }) ?? readStringParam(actionParams, "media", { trim: false });
		if (!filePath) throw new Error("upload-file requires filePath, path, or media");
		const threadId = readStringParam(actionParams, "threadId") ?? readStringParam(actionParams, "replyTo");
		return await invoke({
			action: "uploadFile",
			to,
			filePath,
			initialComment: readStringParam(actionParams, "initialComment", { allowEmpty: true }) ?? readStringParam(actionParams, "message", { allowEmpty: true }) ?? "",
			filename: readStringParam(actionParams, "filename"),
			title: readStringParam(actionParams, "title"),
			threadTs: threadId ?? void 0,
			accountId
		}, cfg, ctx.toolContext);
	}
	throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
}
//#endregion
//#region extensions/slack/src/channel-actions.ts
let slackActionRuntimePromise$1;
async function loadSlackActionRuntime$1() {
	slackActionRuntimePromise$1 ??= import("./action-runtime.runtime-DhNmFnvg.js");
	return await slackActionRuntimePromise$1;
}
function createSlackActions(providerId, options) {
	return {
		describeMessageTool: describeSlackMessageTool,
		extractToolSend: ({ args }) => extractSlackToolSend(args),
		handleAction: async (ctx) => {
			return await handleSlackMessageAction({
				providerId,
				ctx,
				normalizeChannelId: resolveSlackChannelId,
				includeReadThreadId: true,
				invoke: async (action, cfg, toolContext) => await (options?.invoke ? options.invoke(action, cfg, toolContext) : (await loadSlackActionRuntime$1()).handleSlackAction(action, cfg, {
					...toolContext,
					mediaLocalRoots: ctx.mediaLocalRoots,
					mediaReadFile: ctx.mediaReadFile
				}))
			});
		}
	};
}
//#endregion
//#region extensions/slack/src/channel-type.ts
const SLACK_CHANNEL_TYPE_CACHE = /* @__PURE__ */ new Map();
async function resolveSlackChannelType(params) {
	const channelId = params.channelId.trim();
	if (!channelId) return "unknown";
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const cacheKey = `${account.accountId}:${channelId}`;
	const cached = SLACK_CHANNEL_TYPE_CACHE.get(cacheKey);
	if (cached) return cached;
	const groupChannels = normalizeAllowListLower(account.dm?.groupChannels);
	const channelIdLower = normalizeLowercaseStringOrEmpty(channelId);
	if (groupChannels.includes(channelIdLower) || groupChannels.includes(`slack:${channelIdLower}`) || groupChannels.includes(`channel:${channelIdLower}`) || groupChannels.includes(`group:${channelIdLower}`) || groupChannels.includes(`mpim:${channelIdLower}`)) {
		SLACK_CHANNEL_TYPE_CACHE.set(cacheKey, "group");
		return "group";
	}
	if (Object.keys(account.channels ?? {}).some((key) => {
		const normalized = normalizeLowercaseStringOrEmpty(key);
		return normalized === channelIdLower || normalized === `channel:${channelIdLower}` || normalized.replace(/^#/, "") === channelIdLower;
	})) {
		SLACK_CHANNEL_TYPE_CACHE.set(cacheKey, "channel");
		return "channel";
	}
	const token = normalizeOptionalString(account.botToken) ?? normalizeOptionalString(account.config.userToken) ?? "";
	if (!token) {
		SLACK_CHANNEL_TYPE_CACHE.set(cacheKey, "unknown");
		return "unknown";
	}
	try {
		const channel = (await createSlackWebClient(token).conversations.info({ channel: channelId })).channel;
		const type = channel?.is_im ? "dm" : channel?.is_mpim ? "group" : "channel";
		SLACK_CHANNEL_TYPE_CACHE.set(cacheKey, type);
		return type;
	} catch {
		SLACK_CHANNEL_TYPE_CACHE.set(cacheKey, "unknown");
		return "unknown";
	}
}
function __resetSlackChannelTypeCacheForTest() {
	SLACK_CHANNEL_TYPE_CACHE.clear();
}
//#endregion
//#region extensions/slack/src/scopes.ts
function collectScopes(value, into) {
	if (!value) return;
	if (Array.isArray(value)) {
		for (const entry of value) if (typeof entry === "string" && entry.trim()) into.push(entry.trim());
		return;
	}
	if (typeof value === "string") {
		const raw = value.trim();
		if (!raw) return;
		const parts = raw.split(/[,\s]+/).map((part) => part.trim());
		for (const part of parts) if (part) into.push(part);
		return;
	}
	if (!isRecord(value)) return;
	for (const entry of Object.values(value)) if (Array.isArray(entry) || typeof entry === "string") collectScopes(entry, into);
}
function normalizeScopes(scopes) {
	return Array.from(new Set(scopes.map((scope) => scope.trim()).filter(Boolean))).toSorted();
}
function extractScopes(payload) {
	if (!isRecord(payload)) return [];
	const scopes = [];
	collectScopes(payload.scopes, scopes);
	collectScopes(payload.scope, scopes);
	if (isRecord(payload.info)) {
		collectScopes(payload.info.scopes, scopes);
		collectScopes(payload.info.scope, scopes);
		collectScopes(payload.info.user_scopes, scopes);
		collectScopes(payload.info.bot_scopes, scopes);
	}
	return normalizeScopes(scopes);
}
async function callSlack(client, method) {
	try {
		const result = await client.apiCall(method);
		return isRecord(result) ? result : null;
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function fetchSlackScopes(token, timeoutMs) {
	const client = createSlackWebClient(token, { timeout: timeoutMs });
	const attempts = ["auth.scopes", "apps.permissions.info"];
	const errors = [];
	for (const method of attempts) {
		const result = await callSlack(client, method);
		const scopes = extractScopes(result);
		if (scopes.length > 0) return {
			ok: true,
			scopes,
			source: method
		};
		const error = isRecord(result) ? normalizeOptionalString(result.error) : void 0;
		if (error) errors.push(`${method}: ${error}`);
	}
	return {
		ok: false,
		error: errors.length > 0 ? errors.join(" | ") : "no scopes returned"
	};
}
//#endregion
//#region extensions/slack/src/threading-tool-context.ts
function buildSlackThreadingToolContext(params) {
	const configuredReplyToMode = resolveSlackReplyToMode(resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}), params.context.ChatType);
	const effectiveReplyToMode = params.context.MessageThreadId != null ? "all" : configuredReplyToMode;
	const threadId = params.context.MessageThreadId ?? params.context.ReplyToId;
	return {
		currentChannelId: params.context.To?.startsWith("channel:") ? params.context.To.slice(8) : normalizeOptionalString(params.context.NativeChannelId),
		currentThreadTs: threadId != null ? String(threadId) : void 0,
		replyToMode: effectiveReplyToMode,
		hasRepliedRef: params.hasRepliedRef
	};
}
//#endregion
//#region extensions/slack/src/channel.ts
const resolveSlackDmPolicy = createScopedDmSecurityResolver({
	channelKey: "slack",
	resolvePolicy: (account) => account.dm?.policy,
	resolveAllowFrom: (account) => account.dm?.allowFrom,
	allowFromPathSuffix: "dm.",
	normalizeEntry: (raw) => raw.trim().replace(/^(slack|user):/i, "").trim()
});
async function resolveSlackHandleAction() {
	return getOptionalSlackRuntime()?.channel?.slack?.handleSlackAction ?? (await loadSlackActionRuntime()).handleSlackAction;
}
function shouldTreatSlackDeliveredTextAsVisible(params) {
	return params.kind === "block" && typeof params.text === "string" && params.text.trim().length > 0;
}
function getTokenForOperation(account, operation) {
	const userToken = normalizeOptionalString(account.config.userToken);
	const botToken = normalizeOptionalString(account.botToken);
	const allowUserWrites = account.config.userTokenReadOnly === false;
	if (operation === "read") return userToken ?? botToken;
	if (!allowUserWrites) return botToken;
	return botToken ?? userToken;
}
let slackActionRuntimePromise;
let slackSendRuntimePromise;
let slackProbeModulePromise;
let slackMonitorModulePromise;
let slackDirectoryLiveModulePromise;
const loadSlackDirectoryConfigModule = createLazyRuntimeModule(() => import("./directory-config-Guei5fCj.js").then((n) => n.t));
const loadSlackResolveChannelsModule = createLazyRuntimeModule(() => import("./resolve-channels-Bg5kbD8b.js").then((n) => n.n));
const loadSlackResolveUsersModule = createLazyRuntimeModule(() => import("./resolve-users-DMLSy8_5.js").then((n) => n.n));
async function loadSlackActionRuntime() {
	slackActionRuntimePromise ??= import("./action-runtime.runtime-DhNmFnvg.js");
	return await slackActionRuntimePromise;
}
async function loadSlackSendRuntime() {
	slackSendRuntimePromise ??= import("./send.runtime-B9i5OCoP.js");
	return await slackSendRuntimePromise;
}
async function loadSlackProbeModule() {
	slackProbeModulePromise ??= import("./probe-CdvjBc6G.js").then((n) => n.n);
	return await slackProbeModulePromise;
}
async function loadSlackMonitorModule() {
	slackMonitorModulePromise ??= import("./monitor-C2gCA-4h.js").then((n) => n.t);
	return await slackMonitorModulePromise;
}
async function loadSlackDirectoryLiveModule() {
	slackDirectoryLiveModulePromise ??= import("./directory-live-BzEzCTSK.js").then((n) => n.t);
	return await slackDirectoryLiveModulePromise;
}
async function resolveSlackSendContext(params) {
	const send = resolveOutboundSendDep(params.deps, "slack") ?? (await loadSlackSendRuntime()).sendMessageSlack;
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = getTokenForOperation(account, "write");
	const botToken = account.botToken?.trim();
	const tokenOverride = token && token !== botToken ? token : void 0;
	return {
		send,
		threadTsValue: params.replyToId ?? params.threadId,
		tokenOverride
	};
}
function parseSlackExplicitTarget(raw) {
	const target = parseSlackTarget(raw, { defaultKind: "channel" });
	if (!target) return null;
	return {
		to: target.id,
		chatType: target.kind === "user" ? "direct" : "channel"
	};
}
function buildSlackBaseSessionKey(params) {
	return buildOutboundBaseSessionKey({
		...params,
		channel: "slack"
	});
}
async function resolveSlackOutboundSessionRoute(params) {
	const parsed = parseSlackTarget(params.target, { defaultKind: "channel" });
	if (!parsed) return null;
	const isDm = parsed.kind === "user";
	let peerKind = isDm ? "direct" : "channel";
	if (!isDm && /^G/i.test(parsed.id)) {
		const channelType = await resolveSlackChannelType({
			cfg: params.cfg,
			accountId: params.accountId,
			channelId: parsed.id
		});
		if (channelType === "group") peerKind = "group";
		if (channelType === "dm") peerKind = "direct";
	}
	const peer = {
		kind: peerKind,
		id: parsed.id
	};
	const baseSessionKey = buildSlackBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	const threadId = normalizeOutboundThreadId(params.threadId ?? params.replyToId);
	return {
		sessionKey: resolveThreadSessionKeys({
			baseSessionKey,
			threadId
		}).sessionKey,
		baseSessionKey,
		peer,
		chatType: peerKind === "direct" ? "direct" : "channel",
		from: peerKind === "direct" ? `slack:${parsed.id}` : peerKind === "group" ? `slack:group:${parsed.id}` : `slack:channel:${parsed.id}`,
		to: peerKind === "direct" ? `user:${parsed.id}` : `channel:${parsed.id}`,
		threadId
	};
}
function formatSlackScopeDiagnostic(params) {
	const source = params.result.source ? ` (${params.result.source})` : "";
	const label = params.tokenType === "user" ? "User scopes" : "Bot scopes";
	if (params.result.ok && params.result.scopes?.length) return { text: `${label}${source}: ${params.result.scopes.join(", ")}` };
	return {
		text: `${label}: ${params.result.error ?? "scope lookup failed"}`,
		tone: "error"
	};
}
const resolveSlackAllowlistGroupOverrides = createFlatAllowlistOverrideResolver({
	resolveRecord: (account) => account.channels,
	label: (key) => key,
	resolveEntries: (value) => value?.users
});
const resolveSlackAllowlistNames = createAccountScopedAllowlistNameResolver({
	resolveAccount: resolveSlackAccount,
	resolveToken: (account) => normalizeOptionalString(account.config.userToken) ?? normalizeOptionalString(account.botToken),
	resolveNames: async ({ token, entries }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
		token,
		entries
	})
});
const collectSlackSecurityWarnings = createOpenProviderConfiguredRouteWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.slack !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.channels) && Object.keys(account.config.channels ?? {}).length > 0,
	configureRouteAllowlist: {
		surface: "Slack channels",
		openScope: "any channel not explicitly denied",
		groupPolicyPath: "channels.slack.groupPolicy",
		routeAllowlistPath: "channels.slack.channels"
	},
	missingRouteAllowlist: {
		surface: "Slack channels",
		openBehavior: "with no channel allowlist; any channel can trigger (mention-gated)",
		remediation: "Set channels.slack.groupPolicy=\"allowlist\" and configure channels.slack.channels"
	}
});
const slackPlugin = createChatChannelPlugin({
	base: {
		...createSlackPluginBase({
			setupWizard: slackSetupWizard,
			setup: slackSetupAdapter
		}),
		allowlist: {
			...buildLegacyDmAccountAllowlistAdapter({
				channelId: "slack",
				resolveAccount: resolveSlackAccount,
				normalize: ({ cfg, accountId, values }) => slackConfigAdapter.formatAllowFrom({
					cfg,
					accountId,
					allowFrom: values
				}),
				resolveDmAllowFrom: (account) => account.config.allowFrom ?? account.config.dm?.allowFrom,
				resolveGroupPolicy: (account) => account.groupPolicy,
				resolveGroupOverrides: resolveSlackAllowlistGroupOverrides
			}),
			resolveNames: resolveSlackAllowlistNames
		},
		approvalCapability: slackApprovalCapability,
		groups: {
			resolveRequireMention: resolveSlackGroupRequireMention,
			resolveToolPolicy: resolveSlackGroupToolPolicy
		},
		messaging: {
			normalizeTarget: normalizeSlackMessagingTarget,
			resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
				const parent = parentConversationId?.trim();
				const child = conversationId.trim();
				return parent && parent !== child ? {
					to: `channel:${parent}`,
					threadId: child
				} : { to: normalizeSlackMessagingTarget(`channel:${child}`) };
			},
			resolveSessionTarget: ({ id }) => normalizeSlackMessagingTarget(`channel:${id}`),
			parseExplicitTarget: ({ raw }) => parseSlackExplicitTarget(raw),
			inferTargetChatType: ({ to }) => parseSlackExplicitTarget(to)?.chatType,
			resolveOutboundSessionRoute: async (params) => await resolveSlackOutboundSessionRoute(params),
			transformReplyPayload: ({ payload, cfg, accountId }) => isSlackInteractiveRepliesEnabled({
				cfg,
				accountId
			}) ? compileSlackInteractiveReplies(payload) : payload,
			enableInteractiveReplies: ({ cfg, accountId }) => isSlackInteractiveRepliesEnabled({
				cfg,
				accountId
			}),
			hasStructuredReplyPayload: ({ payload }) => {
				try {
					return Boolean(resolveSlackReplyBlocks(payload)?.length);
				} catch {
					return false;
				}
			},
			targetResolver: {
				looksLikeId: looksLikeSlackTargetId,
				hint: "<channelId|user:ID|channel:ID>",
				resolveTarget: async ({ input }) => {
					const parsed = parseSlackExplicitTarget(input);
					if (!parsed) return null;
					return {
						to: parsed.to,
						kind: parsed.chatType === "direct" ? "user" : "group",
						source: "normalized"
					};
				}
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryPeersFromConfig(params),
			listGroups: async (params) => (await loadSlackDirectoryConfigModule()).listSlackDirectoryGroupsFromConfig(params),
			...createRuntimeDirectoryLiveAdapter({
				getRuntime: loadSlackDirectoryLiveModule,
				listPeersLive: (runtime) => runtime.listSlackDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listSlackDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind }) => {
			const toResolvedTarget = (entry, note) => ({
				input: entry.input,
				resolved: entry.resolved,
				id: entry.id,
				name: entry.name,
				note
			});
			const account = resolveSlackAccount({
				cfg,
				accountId
			});
			if (kind === "group") return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.config.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs }) => (await loadSlackResolveChannelsModule()).resolveSlackChannelAllowlist({
					token,
					entries: inputs
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.archived ? "archived" : void 0)
			});
			return resolveTargetsWithOptionalToken({
				token: normalizeOptionalString(account.config.userToken) ?? normalizeOptionalString(account.botToken),
				inputs,
				missingTokenNote: "missing Slack token",
				resolveWithToken: async ({ token, inputs }) => (await loadSlackResolveUsersModule()).resolveSlackUserAllowlist({
					token,
					entries: inputs
				}),
				mapResolved: (entry) => toResolvedTarget(entry, entry.note)
			});
		} },
		actions: createSlackActions(SLACK_CHANNEL, { invoke: async (action, cfg, toolContext) => await (await resolveSlackHandleAction())(action, cfg, toolContext) }),
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
				botTokenSource: snapshot.botTokenSource ?? "none",
				appTokenSource: snapshot.appTokenSource ?? "none"
			}),
			probeAccount: async ({ account, timeoutMs }) => {
				const token = account.botToken?.trim();
				if (!token) return {
					ok: false,
					error: "missing token"
				};
				return await (await loadSlackProbeModule()).probeSlack(token, timeoutMs);
			},
			formatCapabilitiesProbe: ({ probe }) => {
				const slackProbe = probe;
				const lines = [];
				if (slackProbe?.bot?.name) lines.push({ text: `Bot: @${slackProbe.bot.name}` });
				if (slackProbe?.team?.name || slackProbe?.team?.id) {
					const id = slackProbe.team?.id ? ` (${slackProbe.team.id})` : "";
					lines.push({ text: `Team: ${slackProbe.team?.name ?? "unknown"}${id}` });
				}
				return lines;
			},
			buildCapabilitiesDiagnostics: async ({ account, timeoutMs }) => {
				const lines = [];
				const details = {};
				const botToken = account.botToken?.trim();
				const userToken = account.config.userToken?.trim();
				const botScopes = botToken ? await fetchSlackScopes(botToken, timeoutMs) : {
					ok: false,
					error: "Slack bot token missing."
				};
				lines.push(formatSlackScopeDiagnostic({
					tokenType: "bot",
					result: botScopes
				}));
				details.botScopes = botScopes;
				if (userToken) {
					const userScopes = await fetchSlackScopes(userToken, timeoutMs);
					lines.push(formatSlackScopeDiagnostic({
						tokenType: "user",
						result: userScopes
					}));
					details.userScopes = userScopes;
				}
				return {
					lines,
					details
				};
			},
			resolveAccountSnapshot: ({ account }) => {
				const configured = ((account.config.mode ?? "socket") === "http" ? resolveConfiguredFromRequiredCredentialStatuses(account, ["botTokenStatus", "signingSecretStatus"]) : resolveConfiguredFromRequiredCredentialStatuses(account, ["botTokenStatus", "appTokenStatus"])) ?? isSlackPluginAccountConfigured(account);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: { ...projectCredentialSnapshotFields(account) }
				};
			}
		}),
		gateway: { startAccount: async (ctx) => {
			const account = ctx.account;
			const botToken = account.botToken?.trim();
			const appToken = account.appToken?.trim();
			ctx.log?.info(`[${account.accountId}] starting provider`);
			return (await loadSlackMonitorModule()).monitorSlackProvider({
				botToken: botToken ?? "",
				appToken: appToken ?? "",
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				mediaMaxMb: account.config.mediaMaxMb,
				slashCommand: account.config.slashCommand,
				setStatus: ctx.setStatus,
				getStatus: ctx.getStatus
			});
		} },
		mentions: { stripPatterns: () => ["<@[^>\\s]+>"] }
	},
	pairing: { text: {
		idLabel: "slackUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^(slack|user):/i),
		notify: async ({ id, message }) => {
			const cfg = getSlackRuntime().config.loadConfig();
			const account = resolveSlackAccount({
				cfg,
				accountId: resolveDefaultSlackAccountId(cfg)
			});
			const { sendMessageSlack } = await loadSlackSendRuntime();
			const token = getTokenForOperation(account, "write");
			const botToken = account.botToken?.trim();
			const tokenOverride = token && token !== botToken ? token : void 0;
			if (tokenOverride) await sendMessageSlack(`user:${id}`, message, { token: tokenOverride });
			else await sendMessageSlack(`user:${id}`, message);
		}
	} },
	security: {
		resolveDmPolicy: resolveSlackDmPolicy,
		collectWarnings: collectSlackSecurityWarnings,
		collectAuditFindings: collectSlackSecurityAuditFindings
	},
	threading: {
		scopedAccountReplyToMode: {
			resolveAccount: adaptScopedAccountAccessor(resolveSlackAccount),
			resolveReplyToMode: (account, chatType) => resolveSlackReplyToMode(account, chatType)
		},
		allowExplicitReplyTagsWhenOff: false,
		buildToolContext: (params) => buildSlackThreadingToolContext(params),
		resolveAutoThreadId: ({ to, toolContext, replyToId }) => replyToId ? void 0 : resolveSlackAutoThreadId({
			to,
			toolContext
		}),
		resolveReplyTransport: ({ threadId, replyToId }) => ({
			replyToId: replyToId ?? (threadId != null && threadId !== "" ? String(threadId) : void 0),
			threadId: null
		})
	},
	outbound: {
		base: {
			deliveryMode: "direct",
			chunker: null,
			textChunkLimit: SLACK_TEXT_LIMIT,
			shouldTreatDeliveredTextAsVisible: shouldTreatSlackDeliveredTextAsVisible,
			shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload }) => shouldSuppressLocalSlackExecApprovalPrompt({
				cfg,
				accountId,
				payload
			}),
			sendPayload: async (ctx) => {
				const { send, tokenOverride } = await resolveSlackSendContext({
					cfg: ctx.cfg,
					accountId: ctx.accountId ?? void 0,
					deps: ctx.deps,
					replyToId: ctx.replyToId,
					threadId: ctx.threadId
				});
				return await slackOutbound.sendPayload({
					...ctx,
					deps: {
						...ctx.deps,
						slack: async (to, text, opts) => await send(to, text, {
							...opts,
							...tokenOverride ? { token: tokenOverride } : {}
						})
					}
				});
			}
		},
		attachedResults: {
			channel: "slack",
			sendText: async ({ to, text, accountId, deps, replyToId, threadId, cfg }) => {
				const { send, threadTsValue, tokenOverride } = await resolveSlackSendContext({
					cfg,
					accountId: accountId ?? void 0,
					deps,
					replyToId,
					threadId
				});
				return await send(to, text, {
					cfg,
					threadTs: threadTsValue != null ? String(threadTsValue) : void 0,
					accountId: accountId ?? void 0,
					...tokenOverride ? { token: tokenOverride } : {}
				});
			},
			sendMedia: async ({ to, text, mediaUrl, mediaLocalRoots, accountId, deps, replyToId, threadId, cfg }) => {
				const { send, threadTsValue, tokenOverride } = await resolveSlackSendContext({
					cfg,
					accountId: accountId ?? void 0,
					deps,
					replyToId,
					threadId
				});
				return await send(to, text, {
					cfg,
					mediaUrl,
					mediaLocalRoots,
					threadTs: threadTsValue != null ? String(threadTsValue) : void 0,
					accountId: accountId ?? void 0,
					...tokenOverride ? { token: tokenOverride } : {}
				});
			}
		}
	}
});
//#endregion
export { createSlackActions as a, resolveSlackChannelType as i, buildSlackThreadingToolContext as n, resolveSlackAutoThreadId as o, __resetSlackChannelTypeCacheForTest as r, slackPlugin as t };
