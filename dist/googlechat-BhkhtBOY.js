import { r as defineChannelPluginEntry } from "./core-DczSNd0Z.js";
import { n as setGoogleChatRuntime } from "./runtime-Nqn-t5_i.js";
import { t as googlechatPlugin } from "./channel-C3fdH7dp.js";
//#region extensions/googlechat/index.ts
var googlechat_default = defineChannelPluginEntry({
	id: "googlechat",
	name: "Google Chat",
	description: "OpenClaw Google Chat channel plugin",
	plugin: googlechatPlugin,
	setRuntime: setGoogleChatRuntime
});
//#endregion
export { googlechat_default as t };
