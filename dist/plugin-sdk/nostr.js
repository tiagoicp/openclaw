import { h as MarkdownConfigSchema } from "../zod-schema.core-Du3k_7-j.js";
import { r as buildChannelConfigSchema } from "../config-schema-rBqVo6-O.js";
import { t as DEFAULT_ACCOUNT_ID } from "../account-id-CZtNSGs2.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../gateway-request-scope-5NS80CiT.js";
import { c as isBlockedHostnameOrIp } from "../ssrf-Bo89T4pz.js";
import { h as mapAllowFromEntries } from "../channel-config-helpers-Da4M1Ru3.js";
import { n as formatPairingApproveHint } from "../helpers-CRMEpaC8.js";
import { n as emptyPluginConfigSchema } from "../config-schema-3udNz-jR.js";
import { t as createChannelReplyPipeline } from "../channel-reply-pipeline-bDWUO7XT.js";
import { c as collectStatusIssuesFromLastError, d as createDefaultChannelRuntimeState, r as buildComputedAccountStatusSnapshot } from "../status-helpers-C-OjDvUo.js";
import { a as createFixedWindowRateLimiter } from "../webhook-memory-guards-BFnt3UdB.js";
import { c as requestBodyErrorToText, o as readJsonBodyWithLimit } from "../http-body-CxP-aYgD.js";
import { t as createOptionalChannelSetupSurface } from "../channel-setup-4NOmjXiO.js";
import { n as resolveInboundDirectDmAccessWithRuntime, t as createPreCryptoDirectDmAuthorizer } from "../direct-dm-access-B45shWwW.js";
import { t as createDirectDmPreCryptoGuardPolicy } from "../direct-dm-guard-policy-DeO_cEmv.js";
import { t as dispatchInboundDirectDmWithRuntime } from "../direct-dm-D8WD5F5z.js";
//#region src/plugin-sdk/nostr.ts
const nostrSetup = createOptionalChannelSetupSurface({
	channel: "nostr",
	label: "Nostr",
	npmSpec: "@openclaw/nostr",
	docsPath: "/channels/nostr"
});
const nostrSetupAdapter = nostrSetup.setupAdapter;
const nostrSetupWizard = nostrSetup.setupWizard;
//#endregion
export { DEFAULT_ACCOUNT_ID, MarkdownConfigSchema, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, collectStatusIssuesFromLastError, createChannelReplyPipeline, createDefaultChannelRuntimeState, createDirectDmPreCryptoGuardPolicy, createFixedWindowRateLimiter, createPreCryptoDirectDmAuthorizer, dispatchInboundDirectDmWithRuntime, emptyPluginConfigSchema, formatPairingApproveHint, getPluginRuntimeGatewayRequestScope, isBlockedHostnameOrIp, mapAllowFromEntries, nostrSetupAdapter, nostrSetupWizard, readJsonBodyWithLimit, requestBodyErrorToText, resolveInboundDirectDmAccessWithRuntime };
