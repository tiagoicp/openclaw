import "./types.secrets-CeL3gSMO.js";
import "./config-schema-rBqVo6-O.js";
import "./registry-B7jNXbbw.js";
import "./zod-schema.providers-core-B5o6Ezgb.js";
import "./fetch-guard-vsxyWoE4.js";
import "./common-D14k4EfX.js";
import "./fetch-C76RJ2fv.js";
import { n as resolveChannelGroupRequireMention } from "./group-policy-CNAy4Tvq.js";
import "./setup-helpers-DxNOfWja.js";
import "./channel-policy-fpyKQCGQ.js";
import "./dm-policy-shared-GFAS1R1h.js";
import "./setup-wizard-helpers-BrpKVoK7.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import "./channel-pairing-CP5CQA0B.js";
import "./status-helpers-C-OjDvUo.js";
import "./webhook-ingress-OddxVfzA.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-4NOmjXiO.js";
import "./web-media-DCL9w34B.js";
import "./outbound-media-V1H6_xDA.js";
//#region src/plugin-sdk/googlechat.ts
function resolveGoogleChatGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "googlechat",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
const googlechatSetup = createOptionalChannelSetupSurface({
	channel: "googlechat",
	label: "Google Chat",
	npmSpec: "@openclaw/googlechat",
	docsPath: "/channels/googlechat"
});
const googlechatSetupAdapter = googlechatSetup.setupAdapter;
const googlechatSetupWizard = googlechatSetup.setupWizard;
//#endregion
export { googlechatSetupWizard as n, resolveGoogleChatGroupRequireMention as r, googlechatSetupAdapter as t };
