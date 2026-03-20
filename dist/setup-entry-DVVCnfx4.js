import { a as defineSetupPluginEntry } from "./core-DoWJeX1b.js";
import { a as imessageSetupAdapter } from "./setup-core-ph_Fd6Rg.js";
import { i as imessageSetupWizard, n as createIMessagePluginBase } from "./shared-_ilJlvff.js";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = { ...createIMessagePluginBase({
	setupWizard: imessageSetupWizard,
	setup: imessageSetupAdapter
}) };
//#endregion
//#region extensions/imessage/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(imessageSetupPlugin);
//#endregion
export { imessageSetupPlugin as n, setup_entry_default as t };
