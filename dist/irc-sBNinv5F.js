import { ax as defineChannelPluginEntry } from "./pi-embedded-DFNOKLyy.js";
import { n as setIrcRuntime, t as ircPlugin } from "./channel-BVgKXMIr.js";
//#region extensions/irc/index.ts
var irc_default = defineChannelPluginEntry({
	id: "irc",
	name: "IRC",
	description: "IRC channel plugin",
	plugin: ircPlugin,
	setRuntime: setIrcRuntime
});
//#endregion
export { irc_default as t };
