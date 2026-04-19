import { w as readClaudeCliCredentialsCached } from "./store-BkxBSJMW.js";
import "./provider-auth-BfmcRQmu.js";
//#region extensions/anthropic/cli-auth-seam.ts
function readClaudeCliCredentialsForSetup() {
	return readClaudeCliCredentialsCached();
}
function readClaudeCliCredentialsForSetupNonInteractive() {
	return readClaudeCliCredentialsCached({ allowKeychainPrompt: false });
}
function readClaudeCliCredentialsForRuntime() {
	return readClaudeCliCredentialsCached({ allowKeychainPrompt: false });
}
//#endregion
export { readClaudeCliCredentialsForSetup as n, readClaudeCliCredentialsForSetupNonInteractive as r, readClaudeCliCredentialsForRuntime as t };
