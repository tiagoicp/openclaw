import { t as runStatusJsonCommand } from "./status-json-command-2P2oq2RY.js";
import { t as scanStatusJsonFast } from "./status.scan.fast-json-DjsqMcIV.js";
//#region src/commands/status-json.ts
async function statusJsonCommand(opts, runtime) {
	await runStatusJsonCommand({
		opts,
		runtime,
		scanStatusJsonFast,
		includeSecurityAudit: opts.all === true,
		suppressHealthErrors: true
	});
}
//#endregion
export { statusJsonCommand };
