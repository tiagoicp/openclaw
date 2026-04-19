import "./zod-schema.core-Du3k_7-j.js";
import "./config-schema-rBqVo6-O.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-4NOmjXiO.js";
//#region src/plugin-sdk/twitch.ts
const twitchSetup = createOptionalChannelSetupSurface({
	channel: "twitch",
	label: "Twitch",
	npmSpec: "@openclaw/twitch"
});
const twitchSetupAdapter = twitchSetup.setupAdapter;
const twitchSetupWizard = twitchSetup.setupWizard;
//#endregion
export { twitchSetupWizard as n, twitchSetupAdapter as t };
