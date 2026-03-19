import { Ps as createReplyPrefixOptions } from "./auth-profiles-BwxmeQoE.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BuyZMNja.js";
import { t as createPluginRuntimeStore } from "./runtime-store-ChPMsBuD.js";
import { o as normalizeToken } from "./twitch-a8oUyeDG.js";
import { RefreshingAuthProvider, StaticAuthProvider } from "@twurple/auth";
import { ChatClient, LogLevel } from "@twurple/chat";
//#region extensions/twitch/src/token.ts
/**
* Twitch access token resolution with environment variable support.
*
* Supports reading Twitch OAuth access tokens from config or environment variable.
* The OPENCLAW_TWITCH_ACCESS_TOKEN env var is only used for the default account.
*
* Token resolution priority:
* 1. Account access token from merged config (accounts.{id} or base-level for default)
* 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
*/
/**
* Normalize a Twitch OAuth token - ensure it has the oauth: prefix
*/
function normalizeTwitchToken(raw) {
	if (!raw) return;
	const trimmed = raw.trim();
	if (!trimmed) return;
	return trimmed.startsWith("oauth:") ? trimmed : `oauth:${trimmed}`;
}
/**
* Resolve Twitch access token from config or environment variable.
*
* Priority:
* 1. Account access token (from merged config - base-level for default, or accounts.{accountId})
* 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
*
* The getAccountConfig function handles merging base-level config with accounts.default,
* so this logic works for both simplified and multi-account patterns.
*
* @param cfg - OpenClaw config
* @param opts - Options including accountId and optional envToken override
* @returns Token resolution with source
*/
function resolveTwitchToken(cfg, opts = {}) {
	const accountId = normalizeAccountId(opts.accountId);
	const twitchCfg = cfg?.channels?.twitch;
	const accountCfg = accountId === "default" ? twitchCfg?.accounts?.[DEFAULT_ACCOUNT_ID] : twitchCfg?.accounts?.[accountId];
	let token;
	if (accountId === "default") token = normalizeTwitchToken((typeof twitchCfg?.accessToken === "string" ? twitchCfg.accessToken : void 0) || accountCfg?.accessToken);
	else token = normalizeTwitchToken(accountCfg?.accessToken);
	if (token) return {
		token,
		source: "config"
	};
	const envToken = accountId === "default" ? normalizeTwitchToken(opts.envToken ?? process.env.OPENCLAW_TWITCH_ACCESS_TOKEN) : void 0;
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	return {
		token: "",
		source: "none"
	};
}
//#endregion
//#region extensions/twitch/src/twitch-client.ts
/**
* Manages Twitch chat client connections
*/
var TwitchClientManager = class {
	constructor(logger) {
		this.logger = logger;
		this.clients = /* @__PURE__ */ new Map();
		this.messageHandlers = /* @__PURE__ */ new Map();
	}
	/**
	* Create an auth provider for the account.
	*/
	async createAuthProvider(account, normalizedToken) {
		if (!account.clientId) throw new Error("Missing Twitch client ID");
		if (account.clientSecret) {
			const authProvider = new RefreshingAuthProvider({
				clientId: account.clientId,
				clientSecret: account.clientSecret
			});
			await authProvider.addUserForToken({
				accessToken: normalizedToken,
				refreshToken: account.refreshToken ?? null,
				expiresIn: account.expiresIn ?? null,
				obtainmentTimestamp: account.obtainmentTimestamp ?? Date.now()
			}).then((userId) => {
				this.logger.info(`Added user ${userId} to RefreshingAuthProvider for ${account.username}`);
			}).catch((err) => {
				this.logger.error(`Failed to add user to RefreshingAuthProvider: ${err instanceof Error ? err.message : String(err)}`);
			});
			authProvider.onRefresh((userId, token) => {
				this.logger.info(`Access token refreshed for user ${userId} (expires in ${token.expiresIn ? `${token.expiresIn}s` : "unknown"})`);
			});
			authProvider.onRefreshFailure((userId, error) => {
				this.logger.error(`Failed to refresh access token for user ${userId}: ${error.message}`);
			});
			const refreshStatus = account.refreshToken ? "automatic token refresh enabled" : "token refresh disabled (no refresh token)";
			this.logger.info(`Using RefreshingAuthProvider for ${account.username} (${refreshStatus})`);
			return authProvider;
		}
		this.logger.info(`Using StaticAuthProvider for ${account.username} (no clientSecret provided)`);
		return new StaticAuthProvider(account.clientId, normalizedToken);
	}
	/**
	* Get or create a chat client for an account
	*/
	async getClient(account, cfg, accountId) {
		const key = this.getAccountKey(account);
		const existing = this.clients.get(key);
		if (existing) return existing;
		const tokenResolution = resolveTwitchToken(cfg, { accountId });
		if (!tokenResolution.token) {
			this.logger.error(`Missing Twitch token for account ${account.username} (set channels.twitch.accounts.${account.username}.token or OPENCLAW_TWITCH_ACCESS_TOKEN for default)`);
			throw new Error("Missing Twitch token");
		}
		this.logger.debug?.(`Using ${tokenResolution.source} token source for ${account.username}`);
		if (!account.clientId) {
			this.logger.error(`Missing Twitch client ID for account ${account.username}`);
			throw new Error("Missing Twitch client ID");
		}
		const normalizedToken = normalizeToken(tokenResolution.token);
		const client = new ChatClient({
			authProvider: await this.createAuthProvider(account, normalizedToken),
			channels: [account.channel],
			rejoinChannelsOnReconnect: true,
			requestMembershipEvents: true,
			logger: {
				minLevel: LogLevel.WARNING,
				custom: { log: (level, message) => {
					switch (level) {
						case LogLevel.CRITICAL:
							this.logger.error(message);
							break;
						case LogLevel.ERROR:
							this.logger.error(message);
							break;
						case LogLevel.WARNING:
							this.logger.warn(message);
							break;
						case LogLevel.INFO:
							this.logger.info(message);
							break;
						case LogLevel.DEBUG:
							this.logger.debug?.(message);
							break;
						case LogLevel.TRACE:
							this.logger.debug?.(message);
							break;
					}
				} }
			}
		});
		this.setupClientHandlers(client, account);
		client.connect();
		this.clients.set(key, client);
		this.logger.info(`Connected to Twitch as ${account.username}`);
		return client;
	}
	/**
	* Set up message and event handlers for a client
	*/
	setupClientHandlers(client, account) {
		const key = this.getAccountKey(account);
		client.onMessage((channelName, _user, messageText, msg) => {
			const handler = this.messageHandlers.get(key);
			if (handler) {
				const normalizedChannel = channelName.startsWith("#") ? channelName.slice(1) : channelName;
				const from = `twitch:${msg.userInfo.userName}`;
				const preview = messageText.slice(0, 100).replace(/\n/g, "\\n");
				this.logger.debug?.(`twitch inbound: channel=${normalizedChannel} from=${from} len=${messageText.length} preview="${preview}"`);
				handler({
					username: msg.userInfo.userName,
					displayName: msg.userInfo.displayName,
					userId: msg.userInfo.userId,
					message: messageText,
					channel: normalizedChannel,
					id: msg.id,
					timestamp: /* @__PURE__ */ new Date(),
					isMod: msg.userInfo.isMod,
					isOwner: msg.userInfo.isBroadcaster,
					isVip: msg.userInfo.isVip,
					isSub: msg.userInfo.isSubscriber,
					chatType: "group"
				});
			}
		});
		this.logger.info(`Set up handlers for ${key}`);
	}
	/**
	* Set a message handler for an account
	* @returns A function that removes the handler when called
	*/
	onMessage(account, handler) {
		const key = this.getAccountKey(account);
		this.messageHandlers.set(key, handler);
		return () => {
			this.messageHandlers.delete(key);
		};
	}
	/**
	* Disconnect a client
	*/
	async disconnect(account) {
		const key = this.getAccountKey(account);
		const client = this.clients.get(key);
		if (client) {
			client.quit();
			this.clients.delete(key);
			this.messageHandlers.delete(key);
			this.logger.info(`Disconnected ${key}`);
		}
	}
	/**
	* Disconnect all clients
	*/
	async disconnectAll() {
		this.clients.forEach((client) => client.quit());
		this.clients.clear();
		this.messageHandlers.clear();
		this.logger.info(" Disconnected all clients");
	}
	/**
	* Send a message to a channel
	*/
	async sendMessage(account, channel, message, cfg, accountId) {
		try {
			const client = await this.getClient(account, cfg, accountId);
			const messageId = crypto.randomUUID();
			await client.say(channel, message);
			return {
				ok: true,
				messageId
			};
		} catch (error) {
			this.logger.error(`Failed to send message: ${error instanceof Error ? error.message : String(error)}`);
			return {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}
	/**
	* Generate a unique key for an account
	*/
	getAccountKey(account) {
		return `${account.username}:${account.channel}`;
	}
	/**
	* Clear all clients and handlers (for testing)
	*/
	_clearForTest() {
		this.clients.clear();
		this.messageHandlers.clear();
	}
};
//#endregion
//#region extensions/twitch/src/client-manager-registry.ts
/**
* Client manager registry for Twitch plugin.
*
* Manages the lifecycle of TwitchClientManager instances across the plugin,
* ensuring proper cleanup when accounts are stopped or reconfigured.
*/
/**
* Global registry of client managers.
* Keyed by account ID.
*/
const registry = /* @__PURE__ */ new Map();
/**
* Get or create a client manager for an account.
*
* @param accountId - The account ID
* @param logger - Logger instance
* @returns The client manager
*/
function getOrCreateClientManager(accountId, logger) {
	const existing = registry.get(accountId);
	if (existing) return existing.manager;
	const manager = new TwitchClientManager(logger);
	registry.set(accountId, {
		manager,
		accountId,
		logger,
		createdAt: Date.now()
	});
	logger.info(`Registered client manager for account: ${accountId}`);
	return manager;
}
/**
* Get an existing client manager for an account.
*
* @param accountId - The account ID
* @returns The client manager, or undefined if not registered
*/
function getClientManager(accountId) {
	return registry.get(accountId)?.manager;
}
/**
* Disconnect and remove a client manager from the registry.
*
* @param accountId - The account ID
* @returns Promise that resolves when cleanup is complete
*/
async function removeClientManager(accountId) {
	const entry = registry.get(accountId);
	if (!entry) return;
	await entry.manager.disconnectAll();
	registry.delete(accountId);
	entry.logger.info(`Unregistered client manager for account: ${accountId}`);
}
//#endregion
//#region extensions/twitch/src/utils/markdown.ts
/**
* Markdown utilities for Twitch chat
*
* Twitch chat doesn't support markdown formatting, so we strip it before sending.
* Based on OpenClaw's markdownToText in src/agents/tools/web-fetch-utils.ts.
*/
/**
* Strip markdown formatting from text for Twitch compatibility.
*
* Removes images, links, bold, italic, strikethrough, code blocks, inline code,
* headers, and list formatting. Replaces newlines with spaces since Twitch
* is a single-line chat medium.
*
* @param markdown - The markdown text to strip
* @returns Plain text with markdown removed
*/
function stripMarkdownForTwitch(markdown) {
	return markdown.replace(/!\[[^\]]*]\([^)]+\)/g, "").replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1").replace(/~~([^~]+)~~/g, "$1").replace(/```[\s\S]*?```/g, (block) => block.replace(/```[^\n]*\n?/g, "").replace(/```/g, "")).replace(/`([^`]+)`/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[-*+]\s+/gm, "").replace(/^\s*\d+\.\s+/gm, "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ").trim();
}
/**
* Simple word-boundary chunker for Twitch (500 char limit).
* Strips markdown before chunking to avoid breaking markdown patterns.
*
* @param text - The text to chunk
* @param limit - Maximum characters per chunk (Twitch limit is 500)
* @returns Array of text chunks
*/
function chunkTextForTwitch(text, limit) {
	const cleaned = stripMarkdownForTwitch(text);
	if (!cleaned) return [];
	if (limit <= 0) return [cleaned];
	if (cleaned.length <= limit) return [cleaned];
	const chunks = [];
	let remaining = cleaned;
	while (remaining.length > limit) {
		const window = remaining.slice(0, limit);
		const lastSpaceIndex = window.lastIndexOf(" ");
		if (lastSpaceIndex === -1) {
			chunks.push(window);
			remaining = remaining.slice(limit);
		} else {
			chunks.push(window.slice(0, lastSpaceIndex));
			remaining = remaining.slice(lastSpaceIndex + 1);
		}
	}
	if (remaining) chunks.push(remaining);
	return chunks;
}
//#endregion
//#region extensions/twitch/src/runtime.ts
const { setRuntime: setTwitchRuntime, getRuntime: getTwitchRuntime } = createPluginRuntimeStore("Twitch runtime not initialized");
//#endregion
//#region extensions/twitch/src/access-control.ts
/**
* Check if a Twitch message should be allowed based on account configuration
*
* This function implements the access control logic for incoming Twitch messages,
* checking allowlists, role-based restrictions, and mention requirements.
*
* Priority order:
* 1. If `requireMention` is true, message must mention the bot
* 2. If `allowFrom` is set, sender must be in the allowlist (by user ID)
* 3. If `allowedRoles` is set (and `allowFrom` is not), sender must have at least one role
*
* Note: `allowFrom` is a hard allowlist. When set, only those user IDs are allowed.
* Use `allowedRoles` as an alternative when you don't want to maintain an allowlist.
*
* Available roles:
* - "moderator": Moderators
* - "owner": Channel owner/broadcaster
* - "vip": VIPs
* - "subscriber": Subscribers
* - "all": Anyone in the chat
*/
function checkTwitchAccessControl(params) {
	const { message, account, botUsername } = params;
	if (account.requireMention ?? true) {
		if (!extractMentions(message.message).includes(botUsername.toLowerCase())) return {
			allowed: false,
			reason: "message does not mention the bot (requireMention is enabled)"
		};
	}
	if (account.allowFrom !== void 0) {
		const allowFrom = account.allowFrom;
		if (allowFrom.length === 0) return {
			allowed: false,
			reason: "sender is not in allowFrom allowlist"
		};
		const senderId = message.userId;
		if (!senderId) return {
			allowed: false,
			reason: "sender user ID not available for allowlist check"
		};
		if (allowFrom.includes(senderId)) return {
			allowed: true,
			matchKey: senderId,
			matchSource: "allowlist"
		};
		return {
			allowed: false,
			reason: "sender is not in allowFrom allowlist"
		};
	}
	if (account.allowedRoles && account.allowedRoles.length > 0) {
		const allowedRoles = account.allowedRoles;
		if (allowedRoles.includes("all")) return {
			allowed: true,
			matchKey: "all",
			matchSource: "role"
		};
		if (!checkSenderRoles({
			message,
			allowedRoles
		})) return {
			allowed: false,
			reason: `sender does not have any of the required roles: ${allowedRoles.join(", ")}`
		};
		return {
			allowed: true,
			matchKey: allowedRoles.join(","),
			matchSource: "role"
		};
	}
	return { allowed: true };
}
/**
* Check if the sender has any of the allowed roles
*/
function checkSenderRoles(params) {
	const { message, allowedRoles } = params;
	const { isMod, isOwner, isVip, isSub } = message;
	for (const role of allowedRoles) switch (role) {
		case "moderator":
			if (isMod) return true;
			break;
		case "owner":
			if (isOwner) return true;
			break;
		case "vip":
			if (isVip) return true;
			break;
		case "subscriber":
			if (isSub) return true;
			break;
	}
	return false;
}
/**
* Extract @mentions from a Twitch chat message
*
* Returns a list of lowercase usernames that were mentioned in the message.
* Twitch mentions are in the format @username.
*/
function extractMentions(message) {
	const mentionRegex = /@(\w+)/g;
	const mentions = [];
	let match;
	while ((match = mentionRegex.exec(message)) !== null) {
		const username = match[1];
		if (username) mentions.push(username.toLowerCase());
	}
	return mentions;
}
//#endregion
//#region extensions/twitch/src/monitor.ts
/**
* Process an incoming Twitch message and dispatch to agent.
*/
async function processTwitchMessage(params) {
	const { message, account, accountId, config, runtime, core, statusSink } = params;
	const cfg = config;
	const route = core.channel.routing.resolveAgentRoute({
		cfg,
		channel: "twitch",
		accountId,
		peer: {
			kind: "group",
			id: message.channel
		}
	});
	const rawBody = message.message;
	const body = core.channel.reply.formatAgentEnvelope({
		channel: "Twitch",
		from: message.displayName ?? message.username,
		timestamp: message.timestamp?.getTime(),
		envelope: core.channel.reply.resolveEnvelopeFormatOptions(cfg),
		body: rawBody
	});
	const ctxPayload = core.channel.reply.finalizeInboundContext({
		Body: body,
		BodyForAgent: rawBody,
		RawBody: rawBody,
		CommandBody: rawBody,
		From: `twitch:user:${message.userId}`,
		To: `twitch:channel:${message.channel}`,
		SessionKey: route.sessionKey,
		AccountId: route.accountId,
		ChatType: "group",
		ConversationLabel: message.channel,
		SenderName: message.displayName ?? message.username,
		SenderId: message.userId,
		SenderUsername: message.username,
		Provider: "twitch",
		Surface: "twitch",
		MessageSid: message.id,
		OriginatingChannel: "twitch",
		OriginatingTo: `twitch:channel:${message.channel}`
	});
	const storePath = core.channel.session.resolveStorePath(cfg.session?.store, { agentId: route.agentId });
	await core.channel.session.recordInboundSession({
		storePath,
		sessionKey: ctxPayload.SessionKey ?? route.sessionKey,
		ctx: ctxPayload,
		onRecordError: (err) => {
			runtime.error?.(`Failed updating session meta: ${String(err)}`);
		}
	});
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg,
		channel: "twitch",
		accountId
	});
	const { onModelSelected, ...prefixOptions } = createReplyPrefixOptions({
		cfg,
		agentId: route.agentId,
		channel: "twitch",
		accountId
	});
	await core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
		ctx: ctxPayload,
		cfg,
		dispatcherOptions: {
			...prefixOptions,
			deliver: async (payload) => {
				await deliverTwitchReply({
					payload,
					channel: message.channel,
					account,
					accountId,
					config,
					tableMode,
					runtime,
					statusSink
				});
			}
		},
		replyOptions: { onModelSelected }
	});
}
/**
* Deliver a reply to Twitch chat.
*/
async function deliverTwitchReply(params) {
	const { payload, channel, account, accountId, config, runtime, statusSink } = params;
	try {
		const client = await getOrCreateClientManager(accountId, {
			info: (msg) => runtime.log?.(msg),
			warn: (msg) => runtime.log?.(msg),
			error: (msg) => runtime.error?.(msg),
			debug: (msg) => runtime.log?.(msg)
		}).getClient(account, config, accountId);
		if (!client) {
			runtime.error?.(`No client available for sending reply`);
			return;
		}
		if (!payload.text) {
			runtime.error?.(`No text to send in reply payload`);
			return;
		}
		const textToSend = stripMarkdownForTwitch(payload.text);
		await client.say(channel, textToSend);
		statusSink?.({ lastOutboundAt: Date.now() });
	} catch (err) {
		runtime.error?.(`Failed to send reply: ${String(err)}`);
	}
}
/**
* Main monitor provider for Twitch.
*
* Sets up message handlers and processes incoming messages.
*/
async function monitorTwitchProvider(options) {
	const { account, accountId, config, runtime, abortSignal, statusSink } = options;
	const core = getTwitchRuntime();
	let stopped = false;
	const coreLogger = core.logging.getChildLogger({ module: "twitch" });
	const logVerboseMessage = (message) => {
		if (!core.logging.shouldLogVerbose()) return;
		coreLogger.debug?.(message);
	};
	const clientManager = getOrCreateClientManager(accountId, {
		info: (msg) => coreLogger.info(msg),
		warn: (msg) => coreLogger.warn(msg),
		error: (msg) => coreLogger.error(msg),
		debug: logVerboseMessage
	});
	try {
		await clientManager.getClient(account, config, accountId);
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		runtime.error?.(`Failed to connect: ${errorMsg}`);
		throw error;
	}
	const unregisterHandler = clientManager.onMessage(account, (message) => {
		if (stopped) return;
		const botUsername = account.username.toLowerCase();
		if (message.username.toLowerCase() === botUsername) return;
		if (!checkTwitchAccessControl({
			message,
			account,
			botUsername
		}).allowed) return;
		statusSink?.({ lastInboundAt: Date.now() });
		processTwitchMessage({
			message,
			account,
			accountId,
			config,
			runtime,
			core,
			statusSink
		}).catch((err) => {
			runtime.error?.(`Message processing failed: ${String(err)}`);
		});
	});
	const stop = () => {
		stopped = true;
		unregisterHandler();
	};
	abortSignal.addEventListener("abort", stop, { once: true });
	return { stop };
}
//#endregion
export { getClientManager as a, stripMarkdownForTwitch as i, setTwitchRuntime as n, removeClientManager as o, chunkTextForTwitch as r, resolveTwitchToken as s, monitorTwitchProvider as t };
