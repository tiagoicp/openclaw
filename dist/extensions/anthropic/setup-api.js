import { t as definePluginEntry } from "../../plugin-entry-Dzt3gEtQ.js";
import { t as buildAnthropicCliBackend } from "../../cli-backend-DIJLDozy.js";
//#region extensions/anthropic/setup-api.ts
var setup_api_default = definePluginEntry({
	id: "anthropic",
	name: "Anthropic Setup",
	description: "Lightweight Anthropic setup hooks",
	register(api) {
		api.registerCliBackend(buildAnthropicCliBackend());
	}
});
//#endregion
export { setup_api_default as default };
