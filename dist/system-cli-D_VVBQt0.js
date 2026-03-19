import "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import { r as theme } from "./theme-CWrxY1-_.js";
import { t as danger } from "./globals-ir4cuPXg.js";
import { m as defaultRuntime } from "./subsystem-DZirmh0Z.js";
import "./ansi-cwY8Vrne.js";
import "./boolean-B6zcAynR.js";
import "./env-BhXregSC.js";
import "./utils-DHW4u72m.js";
import { t as formatDocsLink } from "./links-BdisHQRU.js";
import "./model-selection-CnnQfpX3.js";
import "./agent-scope-CjT_nq79.js";
import "./boundary-path-C6aAhZ_Z.js";
import "./boundary-file-read-C_4eDsgv.js";
import "./logger-Cpn1HYqp.js";
import "./exec-CmLTXzPB.js";
import "./workspace-v-lU9b6K.js";
import "./io-CT8Gq6Au.js";
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
import "./audit-fs-Dg-uUMPP.js";
import "./resolve-166A8Gzf.js";
import "./tailnet-CITHROcF.js";
import "./net-CF5pU6NS.js";
import "./credentials-CDmoe70o.js";
import "./message-channel-CtOQMf11.js";
import "./method-scopes-umKv_chZ.js";
import "./call-DsrhjEGT.js";
import "./progress-D-tTUmAz.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DnC8vSMU.js";
//#region src/cli/system-cli.ts
const normalizeWakeMode = (raw) => {
	const mode = typeof raw === "string" ? raw.trim() : "";
	if (!mode) return "next-heartbeat";
	if (mode === "now" || mode === "next-heartbeat") return mode;
	throw new Error("--mode must be now or next-heartbeat");
};
async function runSystemGatewayCommand(opts, action, successText) {
	try {
		const result = await action();
		if (opts.json || successText === void 0) defaultRuntime.log(JSON.stringify(result, null, 2));
		else defaultRuntime.log(successText);
	} catch (err) {
		defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	}
}
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.openclaw.ai/cli/system")}\n`);
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			const text = typeof opts.text === "string" ? opts.text.trim() : "";
			if (!text) throw new Error("--text is required");
			return await callGatewayFromCli("wake", opts, {
				mode: normalizeWakeMode(opts.mode),
				text
			}, { expectFinal: false });
		}, "ok");
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	addGatewayClientOptions(heartbeat.command("last").description("Show the last heartbeat event").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("last-heartbeat", opts, void 0, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("enable").description("Enable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: true }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("disable").description("Disable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: false }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(system.command("presence").description("List system presence entries").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("system-presence", opts, void 0, { expectFinal: false });
		});
	});
}
//#endregion
export { registerSystemCli };
