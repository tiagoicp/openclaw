import { n as readSessionUpdatedAt } from "./store-s411RGdM.js";
import "./sessions-BCOzc64x.js";
import { u as resolveStorePath } from "./paths-CEB5IskJ.js";
import { a as resolveEnvelopeFormatOptions } from "./envelope-mqd4bptf.js";
//#region src/channels/session-envelope.ts
function resolveInboundSessionEnvelopeContext(params) {
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	return {
		storePath,
		envelopeOptions: resolveEnvelopeFormatOptions(params.cfg),
		previousTimestamp: readSessionUpdatedAt({
			storePath,
			sessionKey: params.sessionKey
		})
	};
}
//#endregion
export { resolveInboundSessionEnvelopeContext as t };
