import { r as discordSetupAdapter, t as createDiscordPluginBase } from "./shared-DMNuzVKm.js";
import { n as createDiscordSetupWizardProxy } from "./setup-core-DlJaz-Lj.js";
//#endregion
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({
	setupWizard: createDiscordSetupWizardProxy(async () => (await import("./setup-surface-gQe__S0W.js")).discordSetupWizard),
	setup: discordSetupAdapter
}) };
//#endregion
export { discordSetupPlugin as t };
