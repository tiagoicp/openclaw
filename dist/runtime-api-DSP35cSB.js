import "./provider-model-shared-Cl567THa.js";
import "./core-w7kNLu40.js";
import "./routing-CKtHAXfV.js";
import { t as createPluginRuntimeStore } from "./runtime-store-C_guwbh9.js";
import "./channel-policy-fpyKQCGQ.js";
import "./reply-history-DiW9vzqg.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import "./channel-pairing-CP5CQA0B.js";
import "./webhook-targets-lCcRSnKd.js";
import "./webhook-ingress-OddxVfzA.js";
import "./setup-C59mEjks.js";
import "./config-runtime-svP9ZomL.js";
import "./agent-media-payload-BcqM6ZZu.js";
import "./outbound-media-V1H6_xDA.js";
import "./media-runtime-BX5Edo-X.js";
import "./browser-node-runtime-0aChBDGD.js";
import "./command-auth-DYBby0CD.js";
import "./channel-feedback-Cyv7BiEm.js";
import "./channel-inbound-B4DblQju.js";
import "./channel-lifecycle-BQkPZ6nd.js";
import "./channel-status-Bz9FAEWe.js";
//#region extensions/mattermost/src/runtime.ts
const { setRuntime: setMattermostRuntime, getRuntime: getMattermostRuntime } = createPluginRuntimeStore({
	pluginId: "mattermost",
	errorMessage: "Mattermost runtime not initialized"
});
//#endregion
export { setMattermostRuntime as n, getMattermostRuntime as t };
