//#region src/channels/read-only-account-inspect.ts
let discordInspectModulePromise;
let slackInspectModulePromise;
let telegramInspectModulePromise;
function loadDiscordInspectModule() {
	discordInspectModulePromise ??= import("./read-only-account-inspect.discord.runtime-3LBCfP1M.js");
	return discordInspectModulePromise;
}
function loadSlackInspectModule() {
	slackInspectModulePromise ??= import("./read-only-account-inspect.slack.runtime-B1BTD5k5.js");
	return slackInspectModulePromise;
}
function loadTelegramInspectModule() {
	telegramInspectModulePromise ??= import("./read-only-account-inspect.telegram.runtime-2RuzUC6T.js");
	return telegramInspectModulePromise;
}
async function inspectReadOnlyChannelAccount(params) {
	if (params.channelId === "discord") {
		const { inspectDiscordAccount } = await loadDiscordInspectModule();
		return inspectDiscordAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	if (params.channelId === "slack") {
		const { inspectSlackAccount } = await loadSlackInspectModule();
		return inspectSlackAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	if (params.channelId === "telegram") {
		const { inspectTelegramAccount } = await loadTelegramInspectModule();
		return inspectTelegramAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	return null;
}
//#endregion
export { inspectReadOnlyChannelAccount as t };
