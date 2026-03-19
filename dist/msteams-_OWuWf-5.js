import { r as defineChannelPluginEntry } from "./core-DczSNd0Z.js";
import { n as setMSTeamsRuntime } from "./runtime-B1hqiyOZ.js";
import { t as msteamsPlugin } from "./channel-B9qoW3x1.js";
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
