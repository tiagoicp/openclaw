import { a as defineSetupPluginEntry } from "./core-DczSNd0Z.js";
import { r as discordSetupAdapter } from "./setup-core-n6hrOBRK.js";
import { t as createDiscordPluginBase } from "./shared-C045guBt.js";
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({ setup: discordSetupAdapter }) };
//#endregion
//#region extensions/discord/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(discordSetupPlugin);
//#endregion
export { discordSetupPlugin as n, setup_entry_default as t };
