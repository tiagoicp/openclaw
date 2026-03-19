import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { n as setIrcRuntime, t as ircPlugin } from "./channel-eNSQgl5m.js";
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
