import { Ly as webAuthExists } from "./auth-profiles-CPtwVkYW.js";
import { a as defineSetupPluginEntry } from "./core-DoWJeX1b.js";
import { t as whatsappSetupAdapter } from "./setup-core-C5HF8C2U.js";
import { i as whatsappSetupWizardProxy, n as createWhatsAppPluginBase } from "./shared-CdVhad_H.js";
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
