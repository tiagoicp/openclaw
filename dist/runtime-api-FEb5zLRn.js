import "./core-veIgLISV.js";
import "./secret-input-BtxKYnNF.js";
import { t as createPluginRuntimeStore } from "./runtime-store-C_guwbh9.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import "./channel-pairing-CP5CQA0B.js";
import "./status-helpers-C-OjDvUo.js";
import "./webhook-ingress-OddxVfzA.js";
import "./runtime-BVru5p2T.js";
import "./setup-C59mEjks.js";
import "./config-runtime-svP9ZomL.js";
import "./command-auth-B0ygfrmb.js";
import "./channel-feedback-Cyv7BiEm.js";
import "./channel-status-Bz9FAEWe.js";
//#region extensions/zalo/src/runtime.ts
const { setRuntime: setZaloRuntime, getRuntime: getZaloRuntime } = createPluginRuntimeStore({
	pluginId: "zalo",
	errorMessage: "Zalo runtime not initialized"
});
//#endregion
export { setZaloRuntime as n, getZaloRuntime as t };
