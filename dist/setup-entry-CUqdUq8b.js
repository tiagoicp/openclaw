import { ox as defineSetupPluginEntry } from "./pi-embedded-DFNOKLyy.js";
import { r as discordSetupAdapter } from "./setup-core-7e0dZl8_.js";
import { t as createDiscordPluginBase } from "./shared-BB-8muzP.js";
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({ setup: discordSetupAdapter }) };
//#endregion
//#region extensions/discord/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(discordSetupPlugin);
//#endregion
export { discordSetupPlugin as n, setup_entry_default as t };
