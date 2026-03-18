import { A as listDiscordAccountIds, M as resolveDiscordAccount, O as inspectDiscordAccount, j as resolveDefaultDiscordAccountId } from "./auth-profiles-Djd2VmMW.js";
import { n as DiscordConfigSchema } from "./zod-schema.providers-core-JSZEvSLs.js";
import { r as getChatChannelMeta } from "./registry-DHFXbGRB.js";
import { r as buildChannelConfigSchema } from "./config-schema-SbU9iMOP.js";
import { i as createScopedChannelConfigAdapter } from "./channel-config-helpers-DgtPbGwx.js";
import { n as createChannelPluginBase } from "./core-DoWJeX1b.js";
import { t as formatAllowFromLowercase } from "./allow-from-DoBojQVl.js";
import { n as createDiscordSetupWizardProxy } from "./setup-core-BHp6vLOL.js";
//#region extensions/discord/src/shared.ts
const DISCORD_CHANNEL = "discord";
async function loadDiscordChannelRuntime() {
	return await import("./channel.runtime-0Gcv-prc.js");
}
const discordSetupWizard = createDiscordSetupWizardProxy(async () => (await loadDiscordChannelRuntime()).discordSetupWizard);
const discordConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: DISCORD_CHANNEL,
	listAccountIds: listDiscordAccountIds,
	resolveAccount: (cfg, accountId) => resolveDiscordAccount({
		cfg,
		accountId
	}),
	inspectAccount: (cfg, accountId) => inspectDiscordAccount({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultDiscordAccountId,
	clearBaseFields: ["token", "name"],
	resolveAllowFrom: (account) => account.config.dm?.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function createDiscordPluginBase(params) {
	return createChannelPluginBase({
		id: DISCORD_CHANNEL,
		setupWizard: discordSetupWizard,
		meta: { ...getChatChannelMeta(DISCORD_CHANNEL) },
		capabilities: {
			chatTypes: [
				"direct",
				"channel",
				"thread"
			],
			polls: true,
			reactions: true,
			threads: true,
			media: true,
			nativeCommands: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.discord"] },
		configSchema: buildChannelConfigSchema(DiscordConfigSchema),
		config: {
			...discordConfigAdapter,
			isConfigured: (account) => Boolean(account.token?.trim()),
			describeAccount: (account) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: Boolean(account.token?.trim()),
				tokenSource: account.tokenSource
			})
		},
		setup: params.setup
	});
}
//#endregion
export { discordConfigAdapter as n, createDiscordPluginBase as t };
