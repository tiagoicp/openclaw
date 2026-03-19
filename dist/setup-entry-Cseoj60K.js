import { Ly as webAuthExists } from "./auth-profiles-BwxmeQoE.js";
import { a as defineSetupPluginEntry } from "./core-DczSNd0Z.js";
import { t as whatsappSetupAdapter } from "./setup-core-SLYpACR4.js";
import { i as whatsappSetupWizardProxy, n as createWhatsAppPluginBase } from "./shared-p0BR1ONU.js";
//#region extensions/whatsapp/src/channel.setup.ts
const whatsappSetupPlugin = { ...createWhatsAppPluginBase({
	setupWizard: whatsappSetupWizardProxy,
	setup: whatsappSetupAdapter,
	isConfigured: async (account) => await webAuthExists(account.authDir)
}) };
//#endregion
//#region extensions/whatsapp/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(whatsappSetupPlugin);
//#endregion
export { whatsappSetupPlugin as n, setup_entry_default as t };
