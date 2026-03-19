import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { n as setMSTeamsRuntime } from "./runtime-B9b0rJIT.js";
import { t as msteamsPlugin } from "./channel-CLYRngGQ.js";
//#region extensions/msteams/index.ts
var msteams_default = defineChannelPluginEntry({
	id: "msteams",
	name: "Microsoft Teams",
	description: "Microsoft Teams channel plugin (Bot Framework)",
	plugin: msteamsPlugin,
	setRuntime: setMSTeamsRuntime
});
//#endregion
export { msteams_default as t };
