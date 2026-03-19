import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { t as zaloPlugin } from "./channel-SXNCNReY2.js";
import { n as setZaloRuntime } from "./runtime-DCP6DZ2v.js";
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
