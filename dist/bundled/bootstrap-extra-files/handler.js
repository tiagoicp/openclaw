import "../../logger-Bisu6sgz.js";
import "../../paths-D_QmduAc.js";
import "../../tmp-openclaw-dir-CEAo8CGE.js";
import "../../theme-Bnch_o1K.js";
import "../../globals-CnsLPQis.js";
import { t as createSubsystemLogger } from "../../subsystem-Dm-AQqmI.js";
import "../../ansi-BMqrB9En.js";
import "../../boolean-BgLJTske.js";
import "../../utils-CIAfMgvq.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-DcSg74GU.js";
import "../../exec-Bwz57vWc.js";
import { f as filterBootstrapFilesForSession, m as loadExtraBootstrapFilesWithDiagnostics } from "../../workspace-C3BQkKrq.js";
import "../../frontmatter-cz9vUzch.js";
import { i as isAgentBootstrapEvent } from "../../internal-hooks-jmovcAUX.js";
import { n as resolveHookConfig } from "../../config-C32djeDs.js";
//#region src/hooks/bundled/bootstrap-extra-files/handler.ts
const HOOK_KEY = "bootstrap-extra-files";
const log = createSubsystemLogger("bootstrap-extra-files");
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.map((v) => typeof v === "string" ? v.trim() : "").filter(Boolean);
}
function resolveExtraBootstrapPatterns(hookConfig) {
	const fromPaths = normalizeStringArray(hookConfig.paths);
	if (fromPaths.length > 0) return fromPaths;
	const fromPatterns = normalizeStringArray(hookConfig.patterns);
	if (fromPatterns.length > 0) return fromPatterns;
	return normalizeStringArray(hookConfig.files);
}
const bootstrapExtraFilesHook = async (event) => {
	if (!isAgentBootstrapEvent(event)) return;
	const context = event.context;
	const hookConfig = resolveHookConfig(context.cfg, HOOK_KEY);
	if (!hookConfig || hookConfig.enabled === false) return;
	const patterns = resolveExtraBootstrapPatterns(hookConfig);
	if (patterns.length === 0) return;
	try {
		const { files: extras, diagnostics } = await loadExtraBootstrapFilesWithDiagnostics(context.workspaceDir, patterns);
		if (diagnostics.length > 0) log.debug("skipped extra bootstrap candidates", {
			skipped: diagnostics.length,
			reasons: diagnostics.reduce((counts, item) => {
				counts[item.reason] = (counts[item.reason] ?? 0) + 1;
				return counts;
			}, {})
		});
		if (extras.length === 0) return;
		context.bootstrapFiles = filterBootstrapFilesForSession([...context.bootstrapFiles, ...extras], context.sessionKey);
	} catch (err) {
		log.warn(`failed: ${String(err)}`);
	}
};
//#endregion
export { bootstrapExtraFilesHook as default };
