import "./types.secrets-CeL3gSMO.js";
import "./ref-contract-B0QmVSlT.js";
import "./provider-env-vars-CROfvigD.js";
import { n as ensureAuthProfileStore } from "./store-BkxBSJMW.js";
import "./agent-paths-CXWsaLBk.js";
import "./model-auth-markers-DcExIRpy.js";
import { t as resolveEnvApiKey } from "./model-auth-env-4j5eZSCp.js";
import "./models-config.providers.secrets-BUPTPK_h.js";
import { n as listProfilesForProvider } from "./profiles-DGA70W16.js";
import "./repair-CRbbHpEK.js";
import "./provider-auth-input-DWbYKRV6.js";
import "./provider-auth-helpers-UDxcHI9h.js";
import "./provider-api-key-auth-CvUr7rUI.js";
import { createHash, randomBytes } from "node:crypto";
//#region src/plugin-sdk/oauth-utils.ts
/** Encode a flat object as application/x-www-form-urlencoded form data. */
function toFormUrlEncoded(data) {
	return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
/** Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows. */
function generatePkceVerifierChallenge() {
	const verifier = randomBytes(32).toString("base64url");
	return {
		verifier,
		challenge: createHash("sha256").update(verifier).digest("base64url")
	};
}
//#endregion
//#region src/plugin-sdk/provider-auth.ts
function isProviderApiKeyConfigured(params) {
	if (resolveEnvApiKey(params.provider)?.apiKey) return true;
	const agentDir = params.agentDir?.trim();
	if (!agentDir) return false;
	return listProfilesForProvider(ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false }), params.provider).length > 0;
}
//#endregion
export { generatePkceVerifierChallenge as n, toFormUrlEncoded as r, isProviderApiKeyConfigured as t };
