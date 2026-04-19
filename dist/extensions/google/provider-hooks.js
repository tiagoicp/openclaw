import { createGoogleThinkingStreamWrapper } from "./thinking.js";
import "./thinking-api.js";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/google/provider-hooks.ts
const GOOGLE_GEMINI_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
	wrapStreamFn: createGoogleThinkingStreamWrapper
};
//#endregion
export { GOOGLE_GEMINI_PROVIDER_HOOKS };
