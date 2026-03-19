import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { t as bluebubblesPlugin } from "./channel-Dpv4UG_R.js";
import { n as setBlueBubblesRuntime } from "./runtime-BnFT-F03.js";
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
