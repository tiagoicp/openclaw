import "./subsystem-vwBrGICF.js";
import "./provider-env-vars-CROfvigD.js";
import "./failover-error-vTTyysJM.js";
import "./provider-registry-D0ycVHa5.js";
import "./runtime-shared-BVQGUr-l.js";
import "./provider-model-shared-Cl567THa.js";
import "./provider-model-defaults-DL4ndhuw.js";
//#region src/plugin-sdk/image-generation-core.ts
let imageGenerationCoreAuthRuntimePromise;
async function loadImageGenerationCoreAuthRuntime() {
	imageGenerationCoreAuthRuntimePromise ??= import("./image-generation-core.auth.runtime-CDGX5LYx.js");
	return imageGenerationCoreAuthRuntimePromise;
}
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as t };
