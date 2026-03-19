import { a as defineSetupPluginEntry } from "./core-DczSNd0Z.js";
import { a as telegramSetupWizard, o as telegramSetupAdapter, t as createTelegramPluginBase } from "./shared-Bk8CPfG2.js";
//#region extensions/telegram/src/channel.setup.ts
const telegramSetupPlugin = { ...createTelegramPluginBase({
	setupWizard: telegramSetupWizard,
	setup: telegramSetupAdapter
}) };
//#endregion
//#region extensions/telegram/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(telegramSetupPlugin);
//#endregion
export { telegramSetupPlugin as n, setup_entry_default as t };
