import { c as normalizeChatChannelId } from "./registry-DHFXbGRB.js";
import { n as setPluginEnabledInConfig, t as ensurePluginAllowlisted } from "./plugins-allowlist-Dx3qwwff.js";
//#region src/plugins/enable.ts
function enablePluginInConfig(cfg, pluginId) {
	const resolvedId = normalizeChatChannelId(pluginId) ?? pluginId;
	if (cfg.plugins?.enabled === false) return {
		config: cfg,
		enabled: false,
		reason: "plugins disabled"
	};
	if (cfg.plugins?.deny?.includes(pluginId) || cfg.plugins?.deny?.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		reason: "blocked by denylist"
	};
	let next = setPluginEnabledInConfig(cfg, resolvedId, true);
	next = ensurePluginAllowlisted(next, resolvedId);
	return {
		config: next,
		enabled: true
	};
}
//#endregion
export { enablePluginInConfig as t };
