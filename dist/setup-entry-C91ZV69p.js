import { a as defineSetupPluginEntry } from "./core-DoWJeX1b.js";
import { r as discordSetupAdapter } from "./setup-core-BQ56DXxO.js";
import { t as createDiscordPluginBase } from "./shared-BwxjsClk.js";
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({ setup: discordSetupAdapter }) };
//#endregion
//#region extensions/discord/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(discordSetupPlugin);
//#endregion
export { discordSetupPlugin as n, setup_entry_default as t };
