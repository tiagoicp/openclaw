import { t as formatDocsLink } from "../links-CX_lepoz.js";
import { r as buildChannelConfigSchema } from "../config-schema-rBqVo6-O.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-CZtNSGs2.js";
import { t as createDedupeCache } from "../dedupe-B-9LSQr4.js";
import { c as isBlockedHostnameOrIp, t as SsrFBlockedError } from "../ssrf-Bo89T4pz.js";
import { n as fetchWithSsrFGuard } from "../fetch-guard-vsxyWoE4.js";
import { n as emptyPluginConfigSchema } from "../config-schema-3udNz-jR.js";
import { l as patchScopedAccountConfig, t as applyAccountNameToChannelSection } from "../setup-helpers-DxNOfWja.js";
import { t as createChannelReplyPipeline } from "../channel-reply-pipeline-bDWUO7XT.js";
import { r as buildComputedAccountStatusSnapshot } from "../status-helpers-C-OjDvUo.js";
import { t as createLoggerBackedRuntime } from "../runtime-logger-BZr47xiT.js";
import "../runtime-BVru5p2T.js";
import { t as createOptionalChannelSetupSurface } from "../channel-setup-4NOmjXiO.js";
//#region src/plugin-sdk/tlon.ts
const tlonSetup = createOptionalChannelSetupSurface({
	channel: "tlon",
	label: "Tlon",
	npmSpec: "@openclaw/tlon",
	docsPath: "/channels/tlon"
});
const tlonSetupAdapter = tlonSetup.setupAdapter;
const tlonSetupWizard = tlonSetup.setupWizard;
//#endregion
export { DEFAULT_ACCOUNT_ID, SsrFBlockedError, applyAccountNameToChannelSection, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, createChannelReplyPipeline, createDedupeCache, createLoggerBackedRuntime, emptyPluginConfigSchema, fetchWithSsrFGuard, formatDocsLink, isBlockedHostnameOrIp, normalizeAccountId, patchScopedAccountConfig, tlonSetupAdapter, tlonSetupWizard };
