import { t as definePluginEntry } from "../../plugin-entry-Dzt3gEtQ.js";
import { n as buildMinimaxPortalImageGenerationProvider, t as buildMinimaxImageGenerationProvider } from "../../image-generation-provider-kJf-K0Cy.js";
import { n as minimaxPortalMediaUnderstandingProvider, t as minimaxMediaUnderstandingProvider } from "../../media-understanding-provider-CJCxwqQB.js";
import { t as buildMinimaxMusicGenerationProvider } from "../../music-generation-provider-wY2n4AOz.js";
import { t as registerMinimaxProviders } from "../../provider-registration-DT3oJgN9.js";
import { t as buildMinimaxSpeechProvider } from "../../speech-provider-CBE54oZn.js";
import { t as createMiniMaxWebSearchProvider } from "../../minimax-web-search-provider-Cv2LumhB.js";
import { t as buildMinimaxVideoGenerationProvider } from "../../video-generation-provider-Cv9C5x0l.js";
//#region extensions/minimax/index.ts
var minimax_default = definePluginEntry({
	id: "minimax",
	name: "MiniMax",
	description: "Bundled MiniMax API-key and OAuth provider plugin",
	register(api) {
		registerMinimaxProviders(api);
		api.registerMediaUnderstandingProvider(minimaxMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(minimaxPortalMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildMinimaxImageGenerationProvider());
		api.registerImageGenerationProvider(buildMinimaxPortalImageGenerationProvider());
		api.registerMusicGenerationProvider(buildMinimaxMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildMinimaxVideoGenerationProvider());
		api.registerSpeechProvider(buildMinimaxSpeechProvider());
		api.registerWebSearchProvider(createMiniMaxWebSearchProvider());
	}
});
//#endregion
export { minimax_default as default };
