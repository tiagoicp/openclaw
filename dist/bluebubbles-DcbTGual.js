import { ox as defineChannelPluginEntry } from "./pi-embedded-BHLc2HPd.js";
import { t as bluebubblesPlugin } from "./channel-DfOkmJhx.js";
import { n as setBlueBubblesRuntime } from "./runtime-BX0FYCpN.js";
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
