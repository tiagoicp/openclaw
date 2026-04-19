import { t as createPluginRuntimeStore } from "./runtime-store-C_guwbh9.js";
import "./channel-policy-fpyKQCGQ.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import "./channel-pairing-CP5CQA0B.js";
import "./webhook-request-guards-CB27SJb7.js";
import "./webhook-targets-lCcRSnKd.js";
import "./config-runtime-svP9ZomL.js";
import "./outbound-media-V1H6_xDA.js";
import "./ssrf-runtime-CFMDGr4_.js";
import "./media-runtime-BX5Edo-X.js";
import "./channel-config-primitives-BL66o8JX.js";
import "./channel-actions-D2Efrf3J.js";
import "./channel-feedback-Cyv7BiEm.js";
import "./channel-inbound-B4DblQju.js";
import "./channel-lifecycle-BQkPZ6nd.js";
import "./googlechat-runtime-shared-Qs9JO24n.js";
import "./channel-status-Bz9FAEWe.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
