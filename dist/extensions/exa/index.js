import { t as definePluginEntry } from "../../plugin-entry-Dzt3gEtQ.js";
import { t as createExaWebSearchProvider } from "../../exa-web-search-provider-DX2ja8V8.js";
//#region extensions/exa/index.ts
var exa_default = definePluginEntry({
	id: "exa",
	name: "Exa Plugin",
	description: "Bundled Exa web search plugin",
	register(api) {
		api.registerWebSearchProvider(createExaWebSearchProvider());
	}
});
//#endregion
export { exa_default as default };
