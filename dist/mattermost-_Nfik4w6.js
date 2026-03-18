import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { n as registerSlashCommandRoute, r as setMattermostRuntime, t as mattermostPlugin } from "./channel-DPKcYBh9.js";
//#region extensions/mattermost/index.ts
var mattermost_default = defineChannelPluginEntry({
	id: "mattermost",
	name: "Mattermost",
	description: "Mattermost channel plugin",
	plugin: mattermostPlugin,
	setRuntime: setMattermostRuntime,
	registerFull(api) {
		registerSlashCommandRoute(api);
	}
});
//#endregion
export { mattermost_default as t };
