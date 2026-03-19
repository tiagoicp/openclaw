import { i as createScopedChannelConfigAdapter } from "./channel-config-helpers-BRtPQkQ4.js";
import { t as createPluginRuntimeStore } from "./runtime-store-ChPMsBuD.js";
//#region extensions/line/src/runtime.ts
const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } = createPluginRuntimeStore("LINE runtime not initialized - plugin not registered");
//#endregion
//#region extensions/line/src/config-adapter.ts
function resolveLineRuntimeAccount(cfg, accountId) {
	return getLineRuntime().channel.line.resolveLineAccount({
		cfg,
		accountId: accountId ?? void 0
	});
}
function normalizeLineAllowFrom(entry) {
	return entry.replace(/^line:(?:user:)?/i, "");
}
const lineConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "line",
	listAccountIds: (cfg) => getLineRuntime().channel.line.listLineAccountIds(cfg),
	resolveAccount: (cfg, accountId) => resolveLineRuntimeAccount(cfg, accountId),
	defaultAccountId: (cfg) => getLineRuntime().channel.line.resolveDefaultLineAccountId(cfg),
	clearBaseFields: [
		"channelSecret",
		"tokenFile",
		"secretFile"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => allowFrom.map((entry) => String(entry).trim()).filter(Boolean).map(normalizeLineAllowFrom)
});
//#endregion
export { getLineRuntime as n, setLineRuntime as r, lineConfigAdapter as t };
