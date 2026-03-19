import "../../logger-Qep7Kkk8.js";
import "../../paths-C--RM-nt.js";
import "../../tmp-openclaw-dir-DHiu0fYi.js";
import "../../theme-CWrxY1-_.js";
import "../../globals-ir4cuPXg.js";
import { t as createSubsystemLogger } from "../../subsystem-DZirmh0Z.js";
import "../../ansi-cwY8Vrne.js";
import "../../boolean-B6zcAynR.js";
import "../../utils-DHW4u72m.js";
import "../../boundary-path-C6aAhZ_Z.js";
import "../../boundary-file-read-C_4eDsgv.js";
import "../../logger-Cpn1HYqp.js";
import "../../exec-CmLTXzPB.js";
import { f as filterBootstrapFilesForSession, m as loadExtraBootstrapFilesWithDiagnostics } from "../../workspace-v-lU9b6K.js";
import "../../frontmatter-DZ6IQdCY.js";
import { i as isAgentBootstrapEvent } from "../../internal-hooks-C8-czxy2.js";
import { n as resolveHookConfig } from "../../config-DfMEaYAJ.js";
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
