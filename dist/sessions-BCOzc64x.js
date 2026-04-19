import { a as loadConfig } from "./io-CW6SWMPF.js";
import "./store-s411RGdM.js";
import { i as resolveMainSessionKey } from "./main-session-CRdpto3G.js";
import { u as resolveStorePath } from "./paths-CEB5IskJ.js";
import "./reset-qCkOonza.js";
import "./session-key-BiI4wJbR.js";
import { t as deliveryContextFromSession } from "./delivery-context.shared-tY1rfjAI.js";
import { t as loadSessionStore } from "./store-load-yJr1Lyde.js";
import "./transcript-BjJJVfcz.js";
import { t as parseSessionThreadInfo } from "./thread-info-CN2C0IXD.js";
import "./targets-BvoOEox4.js";
//#region src/config/sessions/main-session.runtime.ts
function resolveMainSessionKeyFromConfig() {
	return resolveMainSessionKey(loadConfig());
}
//#endregion
//#region src/config/sessions/delivery-info.ts
function extractDeliveryInfo(sessionKey) {
	const hasRoutableDeliveryContext = (context) => Boolean(context?.channel && context?.to);
	const { baseSessionKey, threadId } = parseSessionThreadInfo(sessionKey);
	if (!sessionKey || !baseSessionKey) return {
		deliveryContext: void 0,
		threadId
	};
	let deliveryContext;
	try {
		const store = loadSessionStore(resolveStorePath(loadConfig().session?.store));
		let entry = store[sessionKey];
		let storedDeliveryContext = deliveryContextFromSession(entry);
		if (!hasRoutableDeliveryContext(storedDeliveryContext) && baseSessionKey !== sessionKey) {
			entry = store[baseSessionKey];
			storedDeliveryContext = deliveryContextFromSession(entry);
		}
		if (hasRoutableDeliveryContext(storedDeliveryContext)) deliveryContext = {
			channel: storedDeliveryContext.channel,
			to: storedDeliveryContext.to,
			accountId: storedDeliveryContext.accountId,
			threadId: storedDeliveryContext.threadId != null ? String(storedDeliveryContext.threadId) : void 0
		};
	} catch {}
	return {
		deliveryContext,
		threadId
	};
}
//#endregion
export { resolveMainSessionKeyFromConfig as n, extractDeliveryInfo as t };
