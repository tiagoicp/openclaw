import { r as defineChannelPluginEntry } from "./core-DoWJeX1b.js";
import { c as setMatrixRuntime } from "./credentials-C8pV-s9g.js";
import { t as matrixPlugin } from "./channel-DSPSe6EK.js";
//#region extensions/matrix/index.ts
var matrix_default = defineChannelPluginEntry({
	id: "matrix",
	name: "Matrix",
	description: "Matrix channel plugin",
	plugin: matrixPlugin,
	setRuntime: setMatrixRuntime
});
//#endregion
export { matrix_default as t };
