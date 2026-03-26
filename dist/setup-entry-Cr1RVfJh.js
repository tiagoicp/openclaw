import { Ca as lineSetupWizard, ox as defineSetupPluginEntry, wa as lineSetupAdapter } from "./pi-embedded-DFNOKLyy.js";
import { t as lineChannelPluginCommon } from "./channel-shared-DJeWiVWp.js";
//#region extensions/line/src/channel.setup.ts
const lineSetupPlugin = {
	id: "line",
	...lineChannelPluginCommon,
	setupWizard: lineSetupWizard,
	setup: lineSetupAdapter
};
//#endregion
//#region extensions/line/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(lineSetupPlugin);
//#endregion
export { lineSetupPlugin as n, setup_entry_default as t };
