import { m as normalizeE164 } from "./utils-CIAfMgvq.js";
import { Dy as listWhatsAppAccountIds, Gi as createDelegatedSetupWizardProxy, Oy as resolveDefaultWhatsAppAccountId, ky as resolveWhatsAppAccount } from "./auth-profiles-CPtwVkYW.js";
import { r as getChatChannelMeta } from "./registry-DHFXbGRB.js";
import { t as WhatsAppConfigSchema } from "./zod-schema.providers-whatsapp-HQNdy-Lo.js";
import { r as buildChannelConfigSchema } from "./config-schema-SbU9iMOP.js";
import { c as collectOpenGroupPolicyRouteAllowlistWarnings, i as collectAllowlistProviderGroupPolicyWarnings } from "./group-policy-warnings-BpL6kBOR.js";
import { i as createScopedChannelConfigAdapter, o as createScopedDmSecurityResolver, u as formatWhatsAppConfigAllowFromEntries } from "./channel-config-helpers-DgtPbGwx.js";
import { n as createChannelPluginBase } from "./core-DoWJeX1b.js";
import { l as resolveWhatsAppGroupRequireMention, n as resolveWhatsAppGroupIntroHint, u as resolveWhatsAppGroupToolPolicy } from "./whatsapp-core-CDBsOcJv.js";
//#region extensions/whatsapp/src/shared.ts
const WHATSAPP_CHANNEL = "whatsapp";
async function loadWhatsAppChannelRuntime() {
	return await import("./channel.runtime-w5yVAXB9.js");
}
const whatsappSetupWizardProxy = createWhatsAppSetupWizardProxy(async () => (await loadWhatsAppChannelRuntime()).whatsappSetupWizard);
const whatsappConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: WHATSAPP_CHANNEL,
	listAccountIds: listWhatsAppAccountIds,
	resolveAccount: (cfg, accountId) => resolveWhatsAppAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultWhatsAppAccountId,
	clearBaseFields: [],
	allowTopLevel: false,
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatWhatsAppConfigAllowFromEntries(allowFrom),
	resolveDefaultTo: (account) => account.defaultTo
});
const whatsappResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: WHATSAPP_CHANNEL,
	resolvePolicy: (account) => account.dmPolicy,
	resolveAllowFrom: (account) => account.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeE164(raw)
});
function createWhatsAppSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel: WHATSAPP_CHANNEL,
		loadWizard,
		status: {
			configuredLabel: "linked",
			unconfiguredLabel: "not linked",
			configuredHint: "linked",
			unconfiguredHint: "not linked",
			configuredScore: 5,
			unconfiguredScore: 4
		},
		resolveShouldPromptAccountIds: (params) => (params.shouldPromptAccountIds || params.options?.promptWhatsAppAccountId) ?? false,
		credentials: [],
		delegateFinalize: true,
		disable: (cfg) => ({
			...cfg,
			channels: {
				...cfg.channels,
				whatsapp: {
					...cfg.channels?.whatsapp,
					enabled: false
				}
			}
		}),
		onAccountRecorded: (accountId, options) => {
			options?.onWhatsAppAccountId?.(accountId);
		}
	});
}
function createWhatsAppPluginBase(params) {
	return createChannelPluginBase({
		id: WHATSAPP_CHANNEL,
		meta: {
			...getChatChannelMeta(WHATSAPP_CHANNEL),
			showConfigured: false,
			quickstartAllowFrom: true,
			forceAccountBinding: true,
			preferSessionLookupForAnnounceTarget: true
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			polls: true,
			reactions: true,
			media: true
		},
		reload: {
			configPrefixes: ["web"],
			noopPrefixes: ["channels.whatsapp"]
		},
		gatewayMethods: ["web.login.start", "web.login.wait"],
		configSchema: buildChannelConfigSchema(WhatsAppConfigSchema),
		config: {
			...whatsappConfigAdapter,
			isEnabled: (account, cfg) => account.enabled && cfg.web?.enabled !== false,
			disabledReason: () => "disabled",
			isConfigured: params.isConfigured,
			unconfiguredReason: () => "not linked",
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: Boolean(account.authDir),
				linked: Boolean(account.authDir),
				dmPolicy: account.dmPolicy,
				allowFrom: account.allowFrom
			})
		},
		security: {
			resolveDmPolicy: whatsappResolveDmPolicy,
			collectWarnings: ({ account, cfg }) => {
				const groupAllowlistConfigured = Boolean(account.groups) && Object.keys(account.groups ?? {}).length > 0;
				return collectAllowlistProviderGroupPolicyWarnings({
					cfg,
					providerConfigPresent: cfg.channels?.whatsapp !== void 0,
					configuredGroupPolicy: account.groupPolicy,
					collect: (groupPolicy) => collectOpenGroupPolicyRouteAllowlistWarnings({
						groupPolicy,
						routeAllowlistConfigured: groupAllowlistConfigured,
						restrictSenders: {
							surface: "WhatsApp groups",
							openScope: "any member in allowed groups",
							groupPolicyPath: "channels.whatsapp.groupPolicy",
							groupAllowFromPath: "channels.whatsapp.groupAllowFrom"
						},
						noRouteAllowlist: {
							surface: "WhatsApp groups",
							routeAllowlistPath: "channels.whatsapp.groups",
							routeScope: "group",
							groupPolicyPath: "channels.whatsapp.groupPolicy",
							groupAllowFromPath: "channels.whatsapp.groupAllowFrom"
						}
					})
				});
			}
		},
		setup: params.setup,
		groups: {
			resolveRequireMention: resolveWhatsAppGroupRequireMention,
			resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
			resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
		}
	});
}
//#endregion
export { whatsappSetupWizardProxy as i, createWhatsAppPluginBase as n, loadWhatsAppChannelRuntime as r, WHATSAPP_CHANNEL as t };
