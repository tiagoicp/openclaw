import { r as ensureAuthProfileStoreForLocalUpdate } from "./store-BkxBSJMW.js";
import { s as writePrivateSecretFileAtomic } from "./secret-file-D3S7BSeN.js";
import "./provider-auth-BfmcRQmu.js";
import "./secret-file-runtime-IhkUM7zz.js";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/openai/openai-codex-cli-bridge.ts
const OPENAI_CODEX_PROVIDER_ID = "openai-codex";
const CODEX_AUTH_ENV_CLEAR_KEYS = ["OPENAI_API_KEY"];
function isCodexBridgeableOAuthCredential(value) {
	return Boolean(value && typeof value === "object" && value !== null && "type" in value && "provider" in value && "access" in value && "refresh" in value && value.type === "oauth" && value.provider === OPENAI_CODEX_PROVIDER_ID && typeof value.access === "string" && value.access.trim().length > 0 && typeof value.refresh === "string" && value.refresh.trim().length > 0);
}
function resolveCodexBridgeHome(agentDir, profileId) {
	const digest = crypto.createHash("sha256").update(profileId).digest("hex").slice(0, 16);
	return path.join(agentDir, "cli-auth", "codex", digest);
}
function buildCodexAuthFile(credential) {
	return `${JSON.stringify({
		auth_mode: "chatgpt",
		tokens: {
			...credential.idToken ? { id_token: credential.idToken } : {},
			access_token: credential.access,
			refresh_token: credential.refresh,
			...credential.accountId ? { account_id: credential.accountId } : {}
		}
	}, null, 2)}\n`;
}
async function prepareOpenAICodexCliExecution(ctx) {
	if (!ctx.agentDir || !ctx.authProfileId) return null;
	const credential = ensureAuthProfileStoreForLocalUpdate(ctx.agentDir).profiles[ctx.authProfileId];
	if (!isCodexBridgeableOAuthCredential(credential)) return null;
	const codexHome = resolveCodexBridgeHome(ctx.agentDir, ctx.authProfileId);
	await writePrivateSecretFileAtomic({
		rootDir: ctx.agentDir,
		filePath: path.join(codexHome, "auth.json"),
		content: buildCodexAuthFile(credential)
	});
	return {
		env: { CODEX_HOME: codexHome },
		clearEnv: [...CODEX_AUTH_ENV_CLEAR_KEYS]
	};
}
//#endregion
export { prepareOpenAICodexCliExecution as t };
