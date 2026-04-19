import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Cp6kIcbn.js";
import { d as ensureAgentWorkspace } from "./workspace-Dphk4K2m.js";
import { b as resolveAgentWorkspaceDir, y as resolveAgentDir } from "./agent-scope-DsH_ZwEW.js";
import { p as resolveThinkingDefault } from "./model-selection-C05AhLK_.js";
import { n as resolveAgentIdentity } from "./identity-CV1tmBet.js";
import { i as saveSessionStore } from "./store-s411RGdM.js";
import "./sessions-BCOzc64x.js";
import { i as resolveSessionFilePath, u as resolveStorePath } from "./paths-CEB5IskJ.js";
import { t as loadSessionStore } from "./store-load-yJr1Lyde.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-runner-DadJfjsd.js";
import { t as resolveAgentTimeoutMs } from "./timeout-CrQtoLUW.js";
import "./pi-embedded-CQR6tn6c.js";
//#region src/extensionAPI.ts
if (process.env.VITEST !== "true" && process.env.OPENCLAW_SUPPRESS_EXTENSION_API_WARNING !== "1") process.emitWarning("openclaw/extension-api is deprecated. Migrate to api.runtime.agent.* or focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration", {
	code: "OPENCLAW_EXTENSION_API_DEPRECATED",
	detail: "This compatibility bridge is temporary. Bundled plugins should use the injected plugin runtime instead of importing host-side agent helpers directly. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration"
});
//#endregion
export { DEFAULT_MODEL, DEFAULT_PROVIDER, ensureAgentWorkspace, loadSessionStore, resolveAgentDir, resolveAgentIdentity, resolveAgentTimeoutMs, resolveAgentWorkspaceDir, resolveSessionFilePath, resolveStorePath, resolveThinkingDefault, runEmbeddedPiAgent, saveSessionStore };
