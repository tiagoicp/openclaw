import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { n as setGoogleChatRuntime } from "./runtime-CEysQdB8.js";
import { t as googlechatPlugin } from "./channel-BCUHhFDz.js";
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
