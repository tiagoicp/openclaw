import "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import "./theme-CWrxY1-_.js";
import "./globals-ir4cuPXg.js";
import "./subsystem-DZirmh0Z.js";
import "./ansi-cwY8Vrne.js";
import "./boolean-B6zcAynR.js";
import "./utils-DHW4u72m.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-CjT_nq79.js";
import "./boundary-path-C6aAhZ_Z.js";
import "./boundary-file-read-C_4eDsgv.js";
import "./logger-Cpn1HYqp.js";
import "./exec-CmLTXzPB.js";
import "./workspace-v-lU9b6K.js";
import "./config-state-ZFfx7wSS.js";
import "./registry-B1w4aWmD.js";
import "./manifest-registry-DX175h3u.js";
import { t as formatCliCommand } from "./command-format-BFcnEFO6.js";
import "./frontmatter-DZ6IQdCY.js";
import "./config-DfMEaYAJ.js";
import "./workspace-C6IA37FT.js";
import { t as buildWorkspaceHookStatus } from "./hooks-status-Dcf9LbP1.js";
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
