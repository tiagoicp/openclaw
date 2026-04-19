import { t as definePluginEntry } from "../../plugin-entry-Dzt3gEtQ.js";
import { n as buildFalImageGenerationProvider } from "../../image-generation-provider-D6PWKswr.js";
import { t as createFalProvider } from "../../provider-registration-Bu6M9cvj.js";
import { n as buildFalVideoGenerationProvider } from "../../video-generation-provider-BOIc9PB1.js";
var fal_default = definePluginEntry({
	id: "fal",
	name: "fal Provider",
	description: "Bundled fal image and video generation provider",
	register(api) {
		api.registerProvider(createFalProvider());
		api.registerImageGenerationProvider(buildFalImageGenerationProvider());
		api.registerVideoGenerationProvider(buildFalVideoGenerationProvider());
	}
});
//#endregion
export { fal_default as default };
