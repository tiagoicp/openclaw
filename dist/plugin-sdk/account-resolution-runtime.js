import { n as resolveNormalizedAccountEntry } from "../account-lookup-CqHPlKDA.js";
import { s as resolveMergedAccountConfig } from "../account-helpers-Cq1Zr5oH.js";
//#region src/plugin-sdk/account-resolution-runtime.ts
/** List normalized configured account ids from a raw channel account record map. */
function listConfiguredAccountIds(params) {
	if (!params.accounts) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const key of Object.keys(params.accounts)) {
		if (!key) continue;
		ids.add(params.normalizeAccountId(key));
	}
	return [...ids];
}
//#endregion
export { listConfiguredAccountIds, resolveMergedAccountConfig, resolveNormalizedAccountEntry };
