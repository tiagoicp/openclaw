import "./utils-D5DtWkEu.js";
import "./types.secrets-CeL3gSMO.js";
import "./config-schema-rBqVo6-O.js";
import "./zod-schema.providers-core-B5o6Ezgb.js";
import "./file-lock-PvC9G-sK.js";
import "./tokens-BC6Cn5aq.js";
import "./mime-CEJW863s.js";
import "./ssrf-Bo89T4pz.js";
import "./fetch-guard-vsxyWoE4.js";
import "./store-B7mMYTxO.js";
import "./json-store-DuJyoV6_.js";
import "./dm-policy-shared-GFAS1R1h.js";
import "./history-DjL0YCvE.js";
import "./setup-wizard-helpers-BrpKVoK7.js";
import "./channel-reply-pipeline-bDWUO7XT.js";
import "./channel-pairing-CP5CQA0B.js";
import "./status-helpers-C-OjDvUo.js";
import "./http-body-CxP-aYgD.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-4NOmjXiO.js";
import "./inbound-reply-dispatch-CVuQKs4f.js";
import "./web-media-DCL9w34B.js";
import "./outbound-media-V1H6_xDA.js";
import "./ssrf-policy-DpRGHY9E.js";
import "./session-envelope-DlFtaHUm.js";
//#region src/plugin-sdk/msteams.ts
const msteamsSetup = createOptionalChannelSetupSurface({
	channel: "msteams",
	label: "Microsoft Teams",
	npmSpec: "@openclaw/msteams",
	docsPath: "/channels/msteams"
});
const msteamsSetupWizard = msteamsSetup.setupWizard;
const msteamsSetupAdapter = msteamsSetup.setupAdapter;
//#endregion
export { msteamsSetupWizard as n, msteamsSetupAdapter as t };
