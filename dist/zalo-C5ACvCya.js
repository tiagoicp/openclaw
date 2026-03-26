import { ox as defineChannelPluginEntry } from "./pi-embedded-BHLc2HPd.js";
import { t as zaloPlugin } from "./channel-BbYb6Oys.js";
import { n as setZaloRuntime } from "./runtime-qTWzb39b.js";
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
