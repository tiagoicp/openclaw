import { N as shouldMigrateStateFromPath } from "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import "./theme-CWrxY1-_.js";
import "./globals-ir4cuPXg.js";
import "./subsystem-DZirmh0Z.js";
import "./ansi-cwY8Vrne.js";
import "./boolean-B6zcAynR.js";
import "./env-BhXregSC.js";
import "./utils-DHW4u72m.js";
import "./model-selection-CnnQfpX3.js";
import "./agent-scope-CjT_nq79.js";
import "./boundary-path-C6aAhZ_Z.js";
import "./boundary-file-read-C_4eDsgv.js";
import "./logger-Cpn1HYqp.js";
import "./exec-CmLTXzPB.js";
import "./workspace-v-lU9b6K.js";
import { d as readConfigFileSnapshot } from "./io-CT8Gq6Au.js";
import "./host-env-security-d-Ny36Hl.js";
import "./safe-text-C0AOXwdt.js";
import "./version-DI1aYFTb.js";
import "./env-substitution-BgU3yPjd.js";
import "./config-state-ZFfx7wSS.js";
import "./includes-YrNTZia-.js";
import "./zod-schema.providers-core-Lq3UWu4O.js";
import "./registry-B1w4aWmD.js";
import "./manifest-registry-DX175h3u.js";
import "./ip-BX5dj8yZ.js";
import "./zod-schema.channels-FynKKE-p.js";
import "./zod-schema.core-Ck0QyHFp.js";
import "./zod-schema.providers-whatsapp-Ju7Eajoi.js";
import "./config-CjBMG9v0.js";
//#region src/cli/program/config-guard.ts
const ALLOWED_INVALID_COMMANDS = new Set([
	"doctor",
	"logs",
	"health",
	"help",
	"status"
]);
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
	"status",
	"probe",
	"health",
	"discover",
	"call",
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
let didRunDoctorConfigFlow = false;
let configSnapshotPromise = null;
function resetConfigGuardStateForTests() {
	didRunDoctorConfigFlow = false;
	configSnapshotPromise = null;
}
async function getConfigSnapshot() {
	if (process.env.VITEST === "true") return readConfigFileSnapshot();
	configSnapshotPromise ??= readConfigFileSnapshot();
	return configSnapshotPromise;
}
async function ensureConfigReady(params) {
	const commandPath = params.commandPath ?? [];
	if (!didRunDoctorConfigFlow && shouldMigrateStateFromPath(commandPath)) {
		didRunDoctorConfigFlow = true;
		const runDoctorConfigFlow = async () => (await import("./doctor-config-flow-24Sb7Qvz.js")).loadAndMaybeMigrateDoctorConfig({
			options: { nonInteractive: true },
			confirm: async () => false
		});
		if (!params.suppressDoctorStdout) await runDoctorConfigFlow();
		else {
			const originalStdoutWrite = process.stdout.write.bind(process.stdout);
			const originalSuppressNotes = process.env.OPENCLAW_SUPPRESS_NOTES;
			process.stdout.write = (() => true);
			process.env.OPENCLAW_SUPPRESS_NOTES = "1";
			try {
				await runDoctorConfigFlow();
			} finally {
				process.stdout.write = originalStdoutWrite;
				if (originalSuppressNotes === void 0) delete process.env.OPENCLAW_SUPPRESS_NOTES;
				else process.env.OPENCLAW_SUPPRESS_NOTES = originalSuppressNotes;
			}
		}
	}
	const snapshot = await getConfigSnapshot();
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const allowInvalid = commandName ? ALLOWED_INVALID_COMMANDS.has(commandName) || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const { formatConfigIssueLines } = await import("./issue-format-WCPa0ktn.js");
	const issues = snapshot.exists && !snapshot.valid ? formatConfigIssueLines(snapshot.issues, "-", { normalizeRoot: true }) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	if (!(snapshot.exists && !snapshot.valid)) return;
	const [{ colorize, isRich, theme }, { shortenHomePath }, { formatCliCommand }] = await Promise.all([
		import("./theme-BAi-ug0-.js"),
		import("./utils-BMVEnN2g.js"),
		import("./command-format-cy9G4eZW.js")
	]);
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	params.runtime.error(heading("Config invalid"));
	params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
	if (issues.length > 0) {
		params.runtime.error(muted("Problem:"));
		params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	if (legacyIssues.length > 0) {
		params.runtime.error(muted("Legacy config keys detected:"));
		params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	params.runtime.error("");
	params.runtime.error(`${muted("Run:")} ${commandText(formatCliCommand("openclaw doctor --fix"))}`);
	if (!allowInvalid) params.runtime.exit(1);
}
const __test__ = { resetConfigGuardStateForTests };
//#endregion
export { __test__, ensureConfigReady };
