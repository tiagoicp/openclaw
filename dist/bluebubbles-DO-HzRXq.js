import { r as defineChannelPluginEntry } from "./core-DczSNd0Z.js";
import { t as bluebubblesPlugin } from "./channel-Dei10i0p.js";
import { n as setBlueBubblesRuntime } from "./runtime-DaWuYohr.js";
//#region extensions/bluebubbles/index.ts
var bluebubbles_default = defineChannelPluginEntry({
	id: "bluebubbles",
	name: "BlueBubbles",
	description: "BlueBubbles channel plugin (macOS app)",
	plugin: bluebubblesPlugin,
	setRuntime: setBlueBubblesRuntime
});
//#endregion
export { bluebubbles_default as t };
