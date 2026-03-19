import { no as resolveDefaultIMessageAccountId, ro as resolveIMessageAccount, to as listIMessageAccountIds } from "./auth-profiles-CPtwVkYW.js";
import { i as IMessageConfigSchema } from "./zod-schema.providers-core-JSZEvSLs.js";
import { r as getChatChannelMeta } from "./registry-DHFXbGRB.js";
import { r as buildChannelConfigSchema } from "./config-schema-SbU9iMOP.js";
import { a as collectAllowlistProviderRestrictSendersWarnings } from "./group-policy-warnings-BpL6kBOR.js";
import { i as createScopedChannelConfigAdapter, l as formatTrimmedAllowFromEntries, o as createScopedDmSecurityResolver } from "./channel-config-helpers-DgtPbGwx.js";
import { n as createChannelPluginBase } from "./core-DoWJeX1b.js";
import { n as createIMessageSetupWizardProxy } from "./setup-core-D_lpGAY2.js";
//#region extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
async function loadIMessageChannelRuntime() {
	return await import("./channel.runtime-B4M9sB9v.js");
}
const imessageSetupWizard = createIMessageSetupWizardProxy(async () => (await loadIMessageChannelRuntime()).imessageSetupWizard);
const imessageConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: IMESSAGE_CHANNEL,
	listAccountIds: listIMessageAccountIds,
	resolveAccount: (cfg, accountId) => resolveIMessageAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultIMessageAccountId,
	clearBaseFields: [
		"cliPath",
		"dbPath",
		"service",
		"region",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatTrimmedAllowFromEntries(allowFrom),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const imessageResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: IMESSAGE_CHANNEL,
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy"
});
function collectIMessageSecurityWarnings(params) {
	return collectAllowlistProviderRestrictSendersWarnings({
		cfg: params.cfg,
		providerConfigPresent: params.cfg.channels?.imessage !== void 0,
		configuredGroupPolicy: params.account.config.groupPolicy,
		surface: "iMessage groups",
		openScope: "any member",
		groupPolicyPath: "channels.imessage.groupPolicy",
		groupAllowFromPath: "channels.imessage.groupAllowFrom",
		mentionGated: false
	});
}
function createIMessagePluginBase(params) {
	return createChannelPluginBase({
		id: IMESSAGE_CHANNEL,
		meta: {
			...getChatChannelMeta(IMESSAGE_CHANNEL),
			aliases: ["imsg"],
			showConfigured: false
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true
		},
		reload: { configPrefixes: ["channels.imessage"] },
		configSchema: buildChannelConfigSchema(IMessageConfigSchema),
		config: {
			...imessageConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured
			})
		},
		security: {
			resolveDmPolicy: imessageResolveDmPolicy,
			collectWarnings: collectIMessageSecurityWarnings
		},
		setup: params.setup
	});
}
//#endregion
export { imessageSetupWizard as i, createIMessagePluginBase as n, imessageResolveDmPolicy as r, collectIMessageSecurityWarnings as t };
