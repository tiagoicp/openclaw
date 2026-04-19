import { r as listChannelPlugins } from "./registry-iW4sIPEh.js";
import "./plugins-RAm7ylrL.js";
//#region src/infra/channels-status-issues.ts
function collectChannelStatusIssues(payload) {
	const issues = [];
	const accountsByChannel = payload.channelAccounts;
	for (const plugin of listChannelPlugins()) {
		const collect = plugin.status?.collectStatusIssues;
		if (!collect) continue;
		const raw = accountsByChannel?.[plugin.id];
		if (!Array.isArray(raw)) continue;
		issues.push(...collect(raw));
	}
	return issues;
}
//#endregion
export { collectChannelStatusIssues as t };
