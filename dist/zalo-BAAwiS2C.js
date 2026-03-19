import { r as defineChannelPluginEntry } from "./core-DczSNd0Z.js";
import { t as zaloPlugin } from "./channel-CpiIs4Oq2.js";
import { n as setZaloRuntime } from "./runtime-CdqD1Y1n.js";
//#region extensions/zalo/index.ts
var zalo_default = defineChannelPluginEntry({
	id: "zalo",
	name: "Zalo",
	description: "Zalo channel plugin",
	plugin: zaloPlugin,
	setRuntime: setZaloRuntime
});
//#endregion
export { zalo_default as t };
