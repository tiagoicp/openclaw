import { sx as defineSetupPluginEntry } from "./pi-embedded-BHLc2HPd.js";
import { a as imessageSetupAdapter } from "./setup-core-CAaCb6v5.js";
import { r as imessageSetupWizard, t as createIMessagePluginBase } from "./shared-D0JDDzxg.js";
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
