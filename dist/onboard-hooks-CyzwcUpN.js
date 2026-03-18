import "./logger-Bisu6sgz.js";
import "./paths-D_QmduAc.js";
import "./tmp-openclaw-dir-CEAo8CGE.js";
import "./theme-Bnch_o1K.js";
import "./globals-CnsLPQis.js";
import "./subsystem-Dm-AQqmI.js";
import "./ansi-BMqrB9En.js";
import "./boolean-BgLJTske.js";
import "./utils-CIAfMgvq.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BvOTVsJZ.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-DcSg74GU.js";
import "./exec-Bwz57vWc.js";
import "./workspace-C3BQkKrq.js";
import "./config-state-DxIr_ZFp.js";
import "./registry-DHFXbGRB.js";
import "./manifest-registry-BN97WD1N.js";
import { t as formatCliCommand } from "./command-format-BGWw_xvQ.js";
import "./frontmatter-cz9vUzch.js";
import "./config-C32djeDs.js";
import "./workspace-CkXlVLL7.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-BaeHvOeQ.js";
//#region src/commands/onboard-hooks.ts
async function setupInternalHooks(cfg, runtime, prompter) {
	await prompter.note([
		"Hooks let you automate actions when agent commands are issued.",
		"Example: Save session context to memory when you issue /new or /reset.",
		"",
		"Learn more: https://docs.openclaw.ai/automation/hooks"
	].join("\n"), "Hooks");
	const eligibleHooks = buildWorkspaceHookStatus(resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)), { config: cfg }).hooks.filter((h) => h.eligible);
	if (eligibleHooks.length === 0) {
		await prompter.note("No eligible hooks found. You can configure hooks later in your config.", "No Hooks Available");
		return cfg;
	}
	const selected = (await prompter.multiselect({
		message: "Enable hooks?",
		options: [{
			value: "__skip__",
			label: "Skip for now"
		}, ...eligibleHooks.map((hook) => ({
			value: hook.name,
			label: `${hook.emoji ?? "🔗"} ${hook.name}`,
			hint: hook.description
		}))]
	})).filter((name) => name !== "__skip__");
	if (selected.length === 0) return cfg;
	const entries = { ...cfg.hooks?.internal?.entries };
	for (const name of selected) entries[name] = { enabled: true };
	const next = {
		...cfg,
		hooks: {
			...cfg.hooks,
			internal: {
				enabled: true,
				entries
			}
		}
	};
	await prompter.note([
		`Enabled ${selected.length} hook${selected.length > 1 ? "s" : ""}: ${selected.join(", ")}`,
		"",
		"You can manage hooks later with:",
		`  ${formatCliCommand("openclaw hooks list")}`,
		`  ${formatCliCommand("openclaw hooks enable <name>")}`,
		`  ${formatCliCommand("openclaw hooks disable <name>")}`
	].join("\n"), "Hooks Configured");
	return next;
}
//#endregion
export { setupInternalHooks };
