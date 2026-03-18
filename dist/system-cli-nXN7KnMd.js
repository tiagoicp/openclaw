import "./logger-Bisu6sgz.js";
import "./paths-D_QmduAc.js";
import "./tmp-openclaw-dir-CEAo8CGE.js";
import { r as theme } from "./theme-Bnch_o1K.js";
import { t as danger } from "./globals-CnsLPQis.js";
import { m as defaultRuntime } from "./subsystem-Dm-AQqmI.js";
import "./ansi-BMqrB9En.js";
import "./boolean-BgLJTske.js";
import "./env-mHZMLTjc.js";
import "./utils-CIAfMgvq.js";
import { t as formatDocsLink } from "./links-DtUd3CJi.js";
import "./model-selection-BvgYPMZN.js";
import "./agent-scope-BvOTVsJZ.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-DcSg74GU.js";
import "./exec-Bwz57vWc.js";
import "./workspace-C3BQkKrq.js";
import "./io-BLrYinYw.js";
import "./host-env-security-DRYydSLp.js";
import "./safe-text-Bls0e7eh.js";
import "./version-BXFMfrjE.js";
import "./env-substitution-CCbMWMw3.js";
import "./config-state-DxIr_ZFp.js";
import "./includes-Babm_gOl.js";
import "./zod-schema.providers-core-JSZEvSLs.js";
import "./registry-DHFXbGRB.js";
import "./manifest-registry-BN97WD1N.js";
import "./ip-COVlKUC6.js";
import "./zod-schema.channels-CLt0EoyM.js";
import "./zod-schema.core-2nNLrIvV.js";
import "./zod-schema.providers-whatsapp-HQNdy-Lo.js";
import "./config-BuXmKtbA.js";
import "./audit-fs-CKHUnnaF.js";
import "./resolve-OpLtNdHa.js";
import "./tailnet-CYknm7bK.js";
import "./net-BDAb36NC.js";
import "./credentials-Dlg2fw8S.js";
import "./message-channel-YbR1kGoD.js";
import "./method-scopes-CIPmQDuC.js";
import "./call-CuSVmxO6.js";
import "./progress-D69d44Ic.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DIvIufRG.js";
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
