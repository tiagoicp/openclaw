import "./utils-D5DtWkEu.js";
import "./types.secrets-CeL3gSMO.js";
import "./setup-helpers-DxNOfWja.js";
import "./setup-wizard-helpers-BrpKVoK7.js";
import "./setup-binary-90JO6Cio.js";
import "./setup-wizard-proxy-Bcb8Y2Hs.js";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
