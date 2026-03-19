import { r as defineChannelPluginEntry } from "./core-DczSNd0Z.js";
import { c as setMatrixRuntime } from "./credentials-IOihXLeg.js";
import { t as matrixPlugin } from "./channel-IzqADZRw.js";
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
