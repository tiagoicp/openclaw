import "./errors-D8p6rxH8.js";
import "./tmp-openclaw-dir-eyAoWbVe.js";
import "./env-CqNoAfUj.js";
import "./file-lock-2eu70u3L.js";
import "./ssrf-Bo89T4pz.js";
import "./fetch-guard-vsxyWoE4.js";
import "./fs-safe-C0Kli84w.js";
import "./exec-approvals-DnKdr6O0.js";
import "./proxy-fetch-jXgXZMy0.js";
import "./undici-global-dispatcher-BQ_y3Zzd.js";
import { n as drainPendingDeliveries$1 } from "./delivery-queue-CN4av0RQ.js";
import "./system-events-vbh3zcBC.js";
import "./retry-Dw_bGHO-.js";
import "./secret-file-D3S7BSeN.js";
import "./http-body-CxP-aYgD.js";
import "./exec-approval-reply-D4L_ILiw.js";
import "./approval-native-runtime-3_e46OzV.js";
import "./exec-approval-command-display-DZrXLPcH.js";
import "./exec-approval-session-target-C7ioybD-.js";
import "./heartbeat-visibility-CcVXqTTA.js";
import "./transport-ready-68FukO1K.js";
import "./identity-DTnWJEmh.js";
import "./retry-policy-kE5vVT0v.js";
import "./ssrf-policy-DpRGHY9E.js";
//#region src/plugin-sdk/infra-runtime.ts
function normalizeWhatsAppReconnectAccountId(accountId) {
	return (accountId ?? "").trim() || "default";
}
const WHATSAPP_NO_LISTENER_ERROR_RE = /No active WhatsApp Web listener/i;
let outboundDeliverRuntimePromise = null;
async function loadOutboundDeliverRuntime() {
	outboundDeliverRuntimePromise ??= import("./deliver-runtime-APgO4UUM.js");
	return await outboundDeliverRuntimePromise;
}
async function drainPendingDeliveries(opts) {
	const deliver = opts.deliver ?? (await loadOutboundDeliverRuntime()).deliverOutboundPayloads;
	await drainPendingDeliveries$1({
		...opts,
		deliver
	});
}
/**
* @deprecated Prefer plugin-owned reconnect policy wired through
* `drainPendingDeliveries(...)`. This compatibility shim preserves the
* historical public SDK symbol for existing plugin callers.
*/
async function drainReconnectQueue(opts) {
	const normalizedAccountId = normalizeWhatsAppReconnectAccountId(opts.accountId);
	await drainPendingDeliveries({
		drainKey: `whatsapp:${normalizedAccountId}`,
		logLabel: "WhatsApp reconnect drain",
		cfg: opts.cfg,
		log: opts.log,
		stateDir: opts.stateDir,
		deliver: opts.deliver,
		selectEntry: (entry) => ({
			match: entry.channel === "whatsapp" && normalizeWhatsAppReconnectAccountId(entry.accountId) === normalizedAccountId && typeof entry.lastError === "string" && WHATSAPP_NO_LISTENER_ERROR_RE.test(entry.lastError),
			bypassBackoff: true
		})
	});
}
//#endregion
export { drainReconnectQueue as n, drainPendingDeliveries as t };
