import { n as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-eyAoWbVe.js";
import { h as MarkdownConfigSchema } from "../zod-schema.core-Du3k_7-j.js";
import { r as buildChannelConfigSchema } from "../config-schema-rBqVo6-O.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-CZtNSGs2.js";
import { c as ToolPolicySchema } from "../zod-schema.agent-runtime-DR2c4w8l.js";
import { i as loadBundledPluginPublicSurfaceModuleSync } from "../facade-loader-DE-UixDZ.js";
import { d as resolveOutboundMediaUrls, h as sendMediaWithLeadingCaption, i as deliverTextOrMediaReply, l as isNumericTargetId, p as resolveSendableOutboundReplyParts, y as sendPayloadWithChunkedTextAndMedia } from "../reply-payload-B7vg_FeY.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "../config-helpers-3aVyuY0F.js";
import { t as createAccountListHelpers } from "../account-helpers-Cq1Zr5oH.js";
import { n as formatPairingApproveHint } from "../helpers-CRMEpaC8.js";
import { n as emptyPluginConfigSchema } from "../config-schema-3udNz-jR.js";
import { l as patchScopedAccountConfig, n as applySetupAccountConfigPatch, s as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../setup-helpers-DxNOfWja.js";
import { i as resolveMentionGatingWithBypass, n as resolveInboundMentionDecision, r as resolveMentionGating } from "../mention-gating-B4D_3AFt.js";
import { i as mergeAllowlist, o as summarizeMapping } from "../resolve-utils-D7SELJFP.js";
import { t as formatAllowFromLowercase } from "../allow-from-CULhQTVN.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "../runtime-group-policy-CNY9C-RM.js";
import { n as isDangerousNameMatchingEnabled } from "../dangerous-name-matching-B5FrVQ3N.js";
import { a as resolveSenderScopedGroupPolicy, t as evaluateGroupRouteAccessForPolicy } from "../group-access-dvrXWg5V.js";
import { X as setTopLevelChannelDmPolicyWithAllowFrom, t as addWildcardAllowFrom, v as mergeAllowFromEntries } from "../setup-wizard-helpers-BrpKVoK7.js";
import { t as createChannelReplyPipeline } from "../channel-reply-pipeline-bDWUO7XT.js";
import { n as createChannelPairingController } from "../channel-pairing-CP5CQA0B.js";
import { t as buildBaseAccountStatusSnapshot } from "../status-helpers-C-OjDvUo.js";
import { t as formatResolvedUnresolvedNote } from "../setup-C59mEjks.js";
import { t as createOptionalChannelSetupSurface } from "../channel-setup-4NOmjXiO.js";
import { t as loadOutboundMediaFromUrl } from "../outbound-media-V1H6_xDA.js";
import { t as chunkTextForOutbound } from "../text-chunking-lDajLZMN.js";
import { a as resolveSenderCommandAuthorization } from "../command-auth-DYBby0CD.js";
import { r as buildChannelSendResult } from "../channel-send-result-Cuc21H78.js";
import { t as resolveChannelAccountConfigBasePath } from "../config-paths-CK_0LkXr.js";
//#region src/plugin-sdk/zalouser.ts
function loadFacadeModule() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "zalouser",
		artifactBasename: "contract-api.js"
	});
}
const collectZalouserSecurityAuditFindings = ((...args) => loadFacadeModule().collectZalouserSecurityAuditFindings(...args));
const zalouserSetup = createOptionalChannelSetupSurface({
	channel: "zalouser",
	label: "Zalo Personal",
	npmSpec: "@openclaw/zalouser",
	docsPath: "/channels/zalouser"
});
const zalouserSetupAdapter = zalouserSetup.setupAdapter;
const zalouserSetupWizard = zalouserSetup.setupWizard;
//#endregion
export { DEFAULT_ACCOUNT_ID, MarkdownConfigSchema, ToolPolicySchema, addWildcardAllowFrom, applyAccountNameToChannelSection, applySetupAccountConfigPatch, buildBaseAccountStatusSnapshot, buildChannelConfigSchema, buildChannelSendResult, chunkTextForOutbound, collectZalouserSecurityAuditFindings, createAccountListHelpers, createChannelPairingController, createChannelReplyPipeline, deleteAccountFromConfigSection, deliverTextOrMediaReply, emptyPluginConfigSchema, evaluateGroupRouteAccessForPolicy, formatAllowFromLowercase, formatPairingApproveHint, formatResolvedUnresolvedNote, isDangerousNameMatchingEnabled, isNumericTargetId, loadOutboundMediaFromUrl, mergeAllowFromEntries, mergeAllowlist, migrateBaseNameToDefaultAccount, normalizeAccountId, patchScopedAccountConfig, resolveChannelAccountConfigBasePath, resolveDefaultGroupPolicy, resolveInboundMentionDecision, resolveMentionGating, resolveMentionGatingWithBypass, resolveOpenProviderRuntimeGroupPolicy, resolveOutboundMediaUrls, resolvePreferredOpenClawTmpDir, resolveSendableOutboundReplyParts, resolveSenderCommandAuthorization, resolveSenderScopedGroupPolicy, sendMediaWithLeadingCaption, sendPayloadWithChunkedTextAndMedia, setAccountEnabledInConfigSection, setTopLevelChannelDmPolicyWithAllowFrom, summarizeMapping, warnMissingProviderGroupPolicyFallbackOnce, zalouserSetupAdapter, zalouserSetupWizard };
