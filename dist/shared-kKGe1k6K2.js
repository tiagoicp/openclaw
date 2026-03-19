import { m as normalizeE164 } from "./utils-CIAfMgvq.js";
import { Cp as resolveDefaultSignalAccountId, Sp as listSignalAccountIds, wp as resolveSignalAccount } from "./auth-profiles-CPtwVkYW.js";
import { s as SignalConfigSchema } from "./zod-schema.providers-core-JSZEvSLs.js";
import { r as getChatChannelMeta } from "./registry-DHFXbGRB.js";
import { r as buildChannelConfigSchema } from "./config-schema-SbU9iMOP.js";
import { a as collectAllowlistProviderRestrictSendersWarnings } from "./group-policy-warnings-BpL6kBOR.js";
import { i as createScopedChannelConfigAdapter, o as createScopedDmSecurityResolver } from "./channel-config-helpers-DgtPbGwx.js";
import { n as createChannelPluginBase } from "./core-DoWJeX1b.js";
import { n as createSignalSetupWizardProxy } from "./setup-core-YthgHkAp2.js";
//#region extensions/signal/src/shared.ts
const SIGNAL_CHANNEL = "signal";
async function loadSignalChannelRuntime() {
	return await import("./channel.runtime-D4Vfyz7V.js");
}
const signalSetupWizard = createSignalSetupWizardProxy(async () => (await loadSignalChannelRuntime()).signalSetupWizard);
const signalConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: SIGNAL_CHANNEL,
	listAccountIds: listSignalAccountIds,
	resolveAccount: (cfg, accountId) => resolveSignalAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultSignalAccountId,
	clearBaseFields: [
		"account",
		"httpUrl",
		"httpHost",
		"httpPort",
		"cliPath",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map((entry) => entry === "*" ? "*" : normalizeE164(entry.replace(/^signal:/i, ""))).filter(Boolean),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const signalResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: SIGNAL_CHANNEL,
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeE164(raw.replace(/^signal:/i, "").trim())
});
function collectSignalSecurityWarnings(params) {
	return collectAllowlistProviderRestrictSendersWarnings({
		cfg: params.cfg,
		providerConfigPresent: params.cfg.channels?.signal !== void 0,
		configuredGroupPolicy: params.account.config.groupPolicy,
		surface: "Signal groups",
		openScope: "any member",
		groupPolicyPath: "channels.signal.groupPolicy",
		groupAllowFromPath: "channels.signal.groupAllowFrom",
		mentionGated: false
	});
}
function createSignalPluginBase(params) {
	return createChannelPluginBase({
		id: SIGNAL_CHANNEL,
		meta: { ...getChatChannelMeta(SIGNAL_CHANNEL) },
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.signal"] },
		configSchema: buildChannelConfigSchema(SignalConfigSchema),
		config: {
			...signalConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				baseUrl: account.baseUrl
			})
		},
		security: {
			resolveDmPolicy: signalResolveDmPolicy,
			collectWarnings: collectSignalSecurityWarnings
		},
		setup: params.setup
	});
}
//#endregion
export { signalSetupWizard as a, signalResolveDmPolicy as i, createSignalPluginBase as n, signalConfigAdapter as r, collectSignalSecurityWarnings as t };
