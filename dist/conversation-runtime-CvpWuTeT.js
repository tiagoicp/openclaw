import "./session-binding-service-C8U6LRDO.js";
import "./binding-registry-DjCY9RWO.js";
import "./conversation-binding-mwj-9Hs6.js";
import "./session-B5H_ij4H.js";
import "./pairing-store-Bpa-5SXl.js";
import "./dm-policy-shared-GFAS1R1h.js";
import "./binding-targets-CKjcJOVe.js";
import "./binding-routing-C9taUABo.js";
import "./thread-bindings-policy-DvMZHdEA.js";
import "./pairing-labels-DelQkAmu.js";
//#region src/channels/session-meta.ts
let inboundSessionRuntimePromise = null;
function loadInboundSessionRuntime() {
	inboundSessionRuntimePromise ??= import("./inbound.runtime-Dz_44GkX.js");
	return inboundSessionRuntimePromise;
}
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordSessionMetaFromInbound({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { recordInboundSessionMetaSafe as t };
