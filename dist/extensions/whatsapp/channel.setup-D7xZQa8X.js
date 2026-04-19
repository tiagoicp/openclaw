import { n as resolveWhatsAppGroupToolPolicy, r as resolveWhatsAppGroupIntroHint, t as resolveWhatsAppGroupRequireMention } from "./group-policy-Cx4Y6WGq.js";
import { r as whatsappSetupWizardProxy, t as createWhatsAppPluginBase } from "./shared-BwdxON2E.js";
import { t as whatsappSetupAdapter } from "./setup-core-BxMH75qa.js";
import { t as detectWhatsAppLegacyStateMigrations } from "./state-migrations-B8ABOle_.js";
import { d as webAuthExists } from "./auth-store-B4KNpGf3.js";
//#region extensions/whatsapp/src/channel.setup.ts
const whatsappSetupPlugin = {
	...createWhatsAppPluginBase({
		groups: {
			resolveRequireMention: resolveWhatsAppGroupRequireMention,
			resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
			resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
		},
		setupWizard: whatsappSetupWizardProxy,
		setup: whatsappSetupAdapter,
		isConfigured: async (account) => await webAuthExists(account.authDir)
	}),
	lifecycle: { detectLegacyStateMigrations: ({ oauthDir }) => detectWhatsAppLegacyStateMigrations({ oauthDir }) }
};
//#endregion
export { whatsappSetupPlugin as t };
