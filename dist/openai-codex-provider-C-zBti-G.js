import { i as formatErrorMessage } from "./errors-D8p6rxH8.js";
import { d as readStringValue, i as normalizeLowercaseStringOrEmpty } from "./string-coerce-BUSzWgUA.js";
import { r as normalizeProviderId } from "./provider-id-D6GoSUK5.js";
import "./defaults-Cp6kIcbn.js";
import { r as ensureAuthProfileStoreForLocalUpdate } from "./store-BkxBSJMW.js";
import { i as normalizeModelCompat } from "./provider-model-compat-5vEo94mk.js";
import { n as listProfilesForProvider } from "./profiles-DGA70W16.js";
import { c as cloneFirstTemplateModel, l as matchesExactOrPrefix } from "./provider-model-shared-Cl567THa.js";
import "./text-runtime-DHfI0VWF.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-CxTMieUH.js";
import "./provider-auth-BfmcRQmu.js";
import "./error-runtime-D3bX8zTc.js";
import { r as loginOpenAICodexOAuth } from "./provider-auth-login-Ik0KBhFH.js";
import { o as findCatalogTemplate } from "./provider-catalog-shared-WlJCcG8_.js";
import { i as fetchCodexUsage } from "./provider-usage-C5h_x8Ai.js";
import { r as resolveCodexAuthIdentity } from "./openai-codex-auth-identity-C870cqCJ.js";
import { r as readOpenAICodexCliOAuthProfile, t as CODEX_CLI_PROFILE_ID } from "./openai-codex-cli-auth-BfBRjJve.js";
import { t as OPENAI_CODEX_DEFAULT_MODEL } from "./default-models-DYE6MSa_.js";
import { n as isOpenAICodexBaseUrl, t as isOpenAIApiBaseUrl } from "./base-url--AbKBx02.js";
import { n as buildOpenAIResponsesProviderHooks, r as buildOpenAISyntheticCatalogEntry } from "./shared-Dk0yLC4M.js";
import { n as buildOpenAICodexProvider } from "./openai-codex-catalog-n_axs5U6.js";
//#region extensions/openai/openai-codex-provider.ts
const PROVIDER_ID = "openai-codex";
const OPENAI_CODEX_BASE_URL = "https://chatgpt.com/backend-api";
const OPENAI_CODEX_GPT_54_MODEL_ID = "gpt-5.4";
const OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID = "gpt-5.4-codex";
const OPENAI_CODEX_GPT_54_PRO_MODEL_ID = "gpt-5.4-pro";
const OPENAI_CODEX_GPT_54_MINI_MODEL_ID = "gpt-5.4-mini";
const OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS = 105e4;
const OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS = 272e3;
const OPENAI_CODEX_GPT_54_MINI_CONTEXT_TOKENS = 272e3;
const OPENAI_CODEX_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CODEX_GPT_54_COST = {
	input: 2.5,
	output: 15,
	cacheRead: .25,
	cacheWrite: 0
};
const OPENAI_CODEX_GPT_54_PRO_COST = {
	input: 30,
	output: 180,
	cacheRead: 0,
	cacheWrite: 0
};
const OPENAI_CODEX_GPT_54_MINI_COST = {
	input: .75,
	output: 4.5,
	cacheRead: .075,
	cacheWrite: 0
};
const OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS = ["gpt-5.3-codex", "gpt-5.2-codex"];
/** Legacy codex rows first; fall back to catalog `gpt-5.4` when the API omits 5.3/5.2. */
const OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS = [...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS, OPENAI_CODEX_GPT_54_MODEL_ID];
const OPENAI_CODEX_GPT_54_MINI_TEMPLATE_MODEL_IDS = [
	OPENAI_CODEX_GPT_54_MODEL_ID,
	"gpt-5.1-codex-mini",
	...OPENAI_CODEX_GPT_54_TEMPLATE_MODEL_IDS
];
const OPENAI_CODEX_GPT_53_MODEL_ID = "gpt-5.3-codex";
const OPENAI_CODEX_GPT_53_SPARK_MODEL_ID = "gpt-5.3-codex-spark";
const OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS = 128e3;
const OPENAI_CODEX_GPT_53_SPARK_MAX_TOKENS = 128e3;
const OPENAI_CODEX_TEMPLATE_MODEL_IDS = ["gpt-5.2-codex"];
const OPENAI_CODEX_XHIGH_MODEL_IDS = [
	OPENAI_CODEX_GPT_54_MODEL_ID,
	OPENAI_CODEX_GPT_54_PRO_MODEL_ID,
	OPENAI_CODEX_GPT_54_MINI_MODEL_ID,
	OPENAI_CODEX_GPT_53_MODEL_ID,
	OPENAI_CODEX_GPT_53_SPARK_MODEL_ID,
	"gpt-5.2-codex",
	"gpt-5.1-codex"
];
const OPENAI_CODEX_MODERN_MODEL_IDS = [
	OPENAI_CODEX_GPT_54_MODEL_ID,
	OPENAI_CODEX_GPT_54_PRO_MODEL_ID,
	OPENAI_CODEX_GPT_54_MINI_MODEL_ID,
	"gpt-5.2",
	"gpt-5.2-codex",
	OPENAI_CODEX_GPT_53_MODEL_ID,
	OPENAI_CODEX_GPT_53_SPARK_MODEL_ID
];
function normalizeCodexTransportFields(params) {
	const useCodexTransport = !params.baseUrl || isOpenAIApiBaseUrl(params.baseUrl) || isOpenAICodexBaseUrl(params.baseUrl);
	const api = useCodexTransport && (!params.api || params.api === "openai-responses") ? "openai-codex-responses" : params.api ?? void 0;
	return {
		api,
		baseUrl: api === "openai-codex-responses" && useCodexTransport ? OPENAI_CODEX_BASE_URL : params.baseUrl
	};
}
function normalizeCodexTransport(model) {
	const canonicalModelId = normalizeLowercaseStringOrEmpty(model.id) === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID ? OPENAI_CODEX_GPT_54_MODEL_ID : model.id;
	const canonicalName = normalizeLowercaseStringOrEmpty(model.name) === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID ? OPENAI_CODEX_GPT_54_MODEL_ID : model.name;
	const normalizedTransport = normalizeCodexTransportFields({
		api: model.api,
		baseUrl: model.baseUrl
	});
	const api = normalizedTransport.api ?? model.api;
	const baseUrl = normalizedTransport.baseUrl ?? model.baseUrl;
	if (api === model.api && baseUrl === model.baseUrl && canonicalModelId === model.id && canonicalName === model.name) return model;
	return {
		...model,
		id: canonicalModelId,
		name: canonicalName,
		api,
		baseUrl
	};
}
function resolveCodexForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	let templateIds;
	let patch;
	if (lower === OPENAI_CODEX_GPT_54_MODEL_ID || lower === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID) {
		templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
		patch = {
			contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
			contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
			cost: OPENAI_CODEX_GPT_54_COST
		};
	} else if (lower === OPENAI_CODEX_GPT_54_PRO_MODEL_ID) {
		templateIds = OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS;
		patch = {
			contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
			contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
			cost: OPENAI_CODEX_GPT_54_PRO_COST
		};
	} else if (lower === OPENAI_CODEX_GPT_54_MINI_MODEL_ID) {
		templateIds = OPENAI_CODEX_GPT_54_MINI_TEMPLATE_MODEL_IDS;
		patch = {
			contextWindow: OPENAI_CODEX_GPT_54_MINI_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_54_MAX_TOKENS,
			cost: OPENAI_CODEX_GPT_54_MINI_COST
		};
	} else if (lower === OPENAI_CODEX_GPT_53_SPARK_MODEL_ID) {
		templateIds = [OPENAI_CODEX_GPT_53_MODEL_ID, ...OPENAI_CODEX_TEMPLATE_MODEL_IDS];
		patch = {
			api: "openai-codex-responses",
			provider: PROVIDER_ID,
			baseUrl: OPENAI_CODEX_BASE_URL,
			reasoning: true,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS,
			maxTokens: OPENAI_CODEX_GPT_53_SPARK_MAX_TOKENS
		};
	} else if (lower === OPENAI_CODEX_GPT_53_MODEL_ID) templateIds = OPENAI_CODEX_TEMPLATE_MODEL_IDS;
	else return;
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: lower === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID ? OPENAI_CODEX_GPT_54_MODEL_ID : trimmedModelId,
		templateIds,
		ctx,
		patch
	}) ?? normalizeModelCompat({
		id: lower === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID ? OPENAI_CODEX_GPT_54_MODEL_ID : trimmedModelId,
		name: lower === OPENAI_CODEX_GPT_54_LEGACY_MODEL_ID ? OPENAI_CODEX_GPT_54_MODEL_ID : trimmedModelId,
		api: "openai-codex-responses",
		provider: PROVIDER_ID,
		baseUrl: OPENAI_CODEX_BASE_URL,
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch?.contextWindow ?? 2e5,
		contextTokens: patch?.contextTokens,
		maxTokens: patch?.maxTokens ?? 2e5
	});
}
async function refreshOpenAICodexOAuthCredential(cred) {
	try {
		const { refreshOpenAICodexToken } = await import("./extensions/openai/openai-codex-provider.runtime.js");
		const refreshed = await refreshOpenAICodexToken(cred.refresh);
		return {
			...cred,
			...refreshed,
			type: "oauth",
			provider: PROVIDER_ID,
			email: cred.email,
			displayName: cred.displayName
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		if (/extract\s+accountid\s+from\s+token/i.test(message) && typeof cred.access === "string" && cred.access.trim().length > 0) return cred;
		throw error;
	}
}
async function runOpenAICodexOAuth(ctx) {
	let creds;
	try {
		creds = await loginOpenAICodexOAuth({
			prompter: ctx.prompter,
			runtime: ctx.runtime,
			isRemote: ctx.isRemote,
			openUrl: ctx.openUrl,
			localBrowserMessage: "Complete sign-in in browser…"
		});
	} catch {
		return { profiles: [] };
	}
	if (!creds) return { profiles: [] };
	const identity = resolveCodexAuthIdentity({
		accessToken: creds.access,
		email: readStringValue(creds.email)
	});
	return buildOauthProviderAuthResult({
		providerId: PROVIDER_ID,
		defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
		access: creds.access,
		refresh: creds.refresh,
		expires: creds.expires,
		email: identity.email,
		profileName: identity.profileName
	});
}
async function runImportOpenAICodexCliAuth(ctx) {
	const profile = readOpenAICodexCliOAuthProfile({
		env: ctx.env ?? process.env,
		store: ensureAuthProfileStoreForLocalUpdate(ctx.agentDir)
	});
	if (!profile) throw new Error("No compatible Codex CLI OAuth login found. Sign in with `codex` first or use ChatGPT OAuth instead.");
	return {
		profiles: [{
			profileId: profile.profileId,
			credential: profile.credential
		}],
		configPatch: { agents: { defaults: { models: { [OPENAI_CODEX_DEFAULT_MODEL]: {} } } } },
		defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
		notes: ["Imported existing Codex CLI login into OpenClaw canonical auth."]
	};
}
function ensureOpenAICodexCatalogAuthStore(ctx) {
	const store = ensureAuthProfileStoreForLocalUpdate(ctx.agentDir);
	const profile = readOpenAICodexCliOAuthProfile({
		env: ctx.env ?? process.env,
		store
	});
	if (!profile) return store;
	return {
		...store,
		profiles: {
			...store.profiles,
			[profile.profileId]: profile.credential
		}
	};
}
function buildOpenAICodexAuthDoctorHint(ctx) {
	if (ctx.profileId !== CODEX_CLI_PROFILE_ID) return;
	return "Deprecated profile. Run `openclaw models auth login --provider openai-codex` or `openclaw configure`.";
}
function buildOpenAICodexProviderPlugin() {
	return {
		id: PROVIDER_ID,
		label: "OpenAI Codex",
		docsPath: "/providers/models",
		auth: [{
			id: "oauth",
			label: "ChatGPT OAuth",
			hint: "Browser sign-in",
			kind: "oauth",
			run: async (ctx) => await runOpenAICodexOAuth(ctx)
		}, {
			id: "import-codex-cli",
			label: "Import Codex CLI login",
			hint: "Use existing .codex auth once",
			kind: "oauth",
			run: async (ctx) => await runImportOpenAICodexCliAuth(ctx)
		}],
		wizard: { setup: {
			choiceId: "openai-codex",
			choiceLabel: "OpenAI Codex (ChatGPT OAuth)",
			choiceHint: "Browser sign-in",
			methodId: "oauth"
		} },
		catalog: {
			order: "profile",
			run: async (ctx) => {
				if (listProfilesForProvider(ensureOpenAICodexCatalogAuthStore(ctx), PROVIDER_ID).length === 0) return null;
				return { provider: buildOpenAICodexProvider() };
			}
		},
		resolveDynamicModel: (ctx) => resolveCodexForwardCompatModel(ctx),
		buildAuthDoctorHint: (ctx) => buildOpenAICodexAuthDoctorHint(ctx),
		supportsXHighThinking: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_CODEX_XHIGH_MODEL_IDS),
		isModernModelRef: ({ modelId }) => matchesExactOrPrefix(modelId, OPENAI_CODEX_MODERN_MODEL_IDS),
		preferRuntimeResolvedModel: (ctx) => {
			if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return false;
			const id = ctx.modelId.trim().toLowerCase();
			return id === OPENAI_CODEX_GPT_54_MODEL_ID || id === OPENAI_CODEX_GPT_54_PRO_MODEL_ID;
		},
		...buildOpenAIResponsesProviderHooks(),
		resolveReasoningOutputMode: () => "native",
		normalizeResolvedModel: (ctx) => {
			if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return;
			return normalizeCodexTransport(ctx.model);
		},
		normalizeTransport: ({ provider, api, baseUrl }) => {
			if (normalizeProviderId(provider) !== PROVIDER_ID) return;
			const normalized = normalizeCodexTransportFields({
				api,
				baseUrl
			});
			if (normalized.api === api && normalized.baseUrl === baseUrl) return;
			return normalized;
		},
		resolveUsageAuth: async (ctx) => await ctx.resolveOAuthToken(),
		fetchUsageSnapshot: async (ctx) => await fetchCodexUsage(ctx.token, ctx.accountId, ctx.timeoutMs, ctx.fetchFn),
		refreshOAuth: async (cred) => await refreshOpenAICodexOAuthCredential(cred),
		resolveExternalAuthProfiles: (ctx) => {
			const profile = readOpenAICodexCliOAuthProfile({
				env: ctx.env,
				store: ctx.store
			});
			return profile ? [{
				...profile,
				persistence: "runtime-only"
			}] : [];
		},
		augmentModelCatalog: (ctx) => {
			const gpt54Template = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_CODEX_GPT_54_CATALOG_SYNTH_TEMPLATE_MODEL_IDS
			});
			const gpt54MiniTemplate = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: OPENAI_CODEX_GPT_54_MINI_TEMPLATE_MODEL_IDS
			});
			const sparkTemplate = findCatalogTemplate({
				entries: ctx.entries,
				providerId: PROVIDER_ID,
				templateIds: [OPENAI_CODEX_GPT_53_MODEL_ID, ...OPENAI_CODEX_TEMPLATE_MODEL_IDS]
			});
			return [
				buildOpenAISyntheticCatalogEntry(gpt54Template, {
					id: OPENAI_CODEX_GPT_54_MODEL_ID,
					reasoning: true,
					input: ["text", "image"],
					contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
					contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
					cost: OPENAI_CODEX_GPT_54_COST
				}),
				buildOpenAISyntheticCatalogEntry(gpt54Template, {
					id: OPENAI_CODEX_GPT_54_PRO_MODEL_ID,
					reasoning: true,
					input: ["text", "image"],
					contextWindow: OPENAI_CODEX_GPT_54_NATIVE_CONTEXT_TOKENS,
					contextTokens: OPENAI_CODEX_GPT_54_DEFAULT_CONTEXT_TOKENS,
					cost: OPENAI_CODEX_GPT_54_PRO_COST
				}),
				buildOpenAISyntheticCatalogEntry(gpt54MiniTemplate, {
					id: OPENAI_CODEX_GPT_54_MINI_MODEL_ID,
					reasoning: true,
					input: ["text", "image"],
					contextWindow: OPENAI_CODEX_GPT_54_MINI_CONTEXT_TOKENS,
					cost: OPENAI_CODEX_GPT_54_MINI_COST
				}),
				buildOpenAISyntheticCatalogEntry(sparkTemplate, {
					id: OPENAI_CODEX_GPT_53_SPARK_MODEL_ID,
					reasoning: true,
					input: ["text"],
					contextWindow: OPENAI_CODEX_GPT_53_SPARK_CONTEXT_TOKENS
				})
			].filter((entry) => entry !== void 0);
		}
	};
}
//#endregion
export { buildOpenAICodexProviderPlugin as t };
