import { r as redactSensitiveText } from "../redact-D4nea1HF.js";
import { t as formatDocsLink } from "../links-CX_lepoz.js";
import { a as hasConfiguredSecretInput, c as normalizeResolvedSecretInputString, l as normalizeSecretInputString } from "../types.secrets-CeL3gSMO.js";
import { s as isPrivateOrLoopbackHost } from "../net-lBInRHnX.js";
import { s as normalizeStringEntries } from "../string-normalization-DpFJ3rD9.js";
import { h as MarkdownConfigSchema } from "../zod-schema.core-Du3k_7-j.js";
import { r as buildChannelConfigSchema } from "../config-schema-rBqVo6-O.js";
import { u as resolveAgentIdFromSessionKey } from "../session-key-DO1ve_TS.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-CZtNSGs2.js";
import { s as getChatChannelMeta } from "../registry-B7jNXbbw.js";
import { c as ToolPolicySchema } from "../zod-schema.agent-runtime-DR2c4w8l.js";
import { i as resolveChannelEntryMatch, n as buildChannelKeyCandidates } from "../channel-config-BaVhmLSz.js";
import { i as resolveAllowlistMatchByCandidates, n as formatAllowlistMatchMeta, o as resolveCompiledAllowlistMatch, r as resolveAllowlistCandidates, t as compileAllowlist } from "../allowlist-match-BApEJ7KY.js";
import { t as resolveAckReaction } from "../identity-CV1tmBet.js";
import { i as loadBundledPluginPublicSurfaceModuleSync, t as createLazyFacadeArrayValue } from "../facade-loader-DE-UixDZ.js";
import { n as fetchWithSsrFGuard } from "../fetch-guard-vsxyWoE4.js";
import { c as jsonResult, d as readNumberParam, f as readReactionParams, h as readStringParam, i as createActionGate, p as readStringArrayParam } from "../common-D14k4EfX.js";
import { r as getAgentScopedMediaLocalRoots } from "../local-roots-CFWDBbIh.js";
import { n as normalizePollInput } from "../polls-B78aNXvC.js";
import { t as resolveOutboundSendDep } from "../send-deps-ChgxnZ0n.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "../config-helpers-3aVyuY0F.js";
import { n as writeJsonFileAtomically, t as readJsonFileWithFallback } from "../json-store-DuJyoV6_.js";
import { a as registerSessionBindingAdapter, o as unregisterSessionBindingAdapter, r as getSessionBindingService } from "../session-binding-service-C8U6LRDO.js";
import { t as createAccountListHelpers } from "../account-helpers-Cq1Zr5oH.js";
import { n as formatPairingApproveHint } from "../helpers-CRMEpaC8.js";
import { n as emptyPluginConfigSchema } from "../config-schema-3udNz-jR.js";
import { c as moveSingleAccountChannelSectionToDefaultAccount, t as applyAccountNameToChannelSection } from "../setup-helpers-DxNOfWja.js";
import { n as formatZonedTimestamp } from "../format-datetime-rwEdVs8W.js";
import { r as buildSecretInputSchema } from "../secret-input-BtxKYnNF.js";
import { n as resolveControlCommandGate } from "../command-gating-B92jamb-.js";
import { a as patchAllowlistUsersInConfigEntries, i as mergeAllowlist, n as buildAllowlistResolutionSummary, o as summarizeMapping, r as canonicalizeAllowlistWithResolvedIds, t as addAllowlistUserEntriesFromConfigEntry } from "../resolve-utils-D7SELJFP.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy, t as GROUP_POLICY_BLOCKED_LABEL } from "../runtime-group-policy-CNY9C-RM.js";
import { a as resolveSenderScopedGroupPolicy, t as evaluateGroupRouteAccessForPolicy } from "../group-access-dvrXWg5V.js";
import { n as logInboundDrop, r as logTypingFailure } from "../logging-D6UFdlyH.js";
import { O as promptAccountId, P as promptSingleChannelSecretInput, Z as setTopLevelChannelGroupPolicy, n as buildSingleChannelSecretPromptState, t as addWildcardAllowFrom, v as mergeAllowFromEntries } from "../setup-wizard-helpers-BrpKVoK7.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-COPj1ZLj.js";
import { n as createReplyPrefixOptions } from "../reply-prefix-DLSoo5Xn.js";
import { t as createTypingCallbacks } from "../typing-DGJh1JIe.js";
import { t as createChannelReplyPipeline } from "../channel-reply-pipeline-bDWUO7XT.js";
import { n as createChannelPairingController } from "../channel-pairing-CP5CQA0B.js";
import { c as collectStatusIssuesFromLastError, i as buildProbeChannelStatusSummary, r as buildComputedAccountStatusSnapshot } from "../status-helpers-C-OjDvUo.js";
import { t as runPluginCommandWithTimeout } from "../run-command-DM_-5kJI.js";
import { n as resolveRuntimeEnv, t as createLoggerBackedRuntime } from "../runtime-logger-BZr47xiT.js";
import "../runtime-BVru5p2T.js";
import { t as promptChannelAccessConfig } from "../setup-group-access-DjzmO_zG.js";
import { t as formatResolvedUnresolvedNote } from "../setup-C59mEjks.js";
import { t as createOptionalChannelSetupSurface } from "../channel-setup-4NOmjXiO.js";
import { t as loadOutboundMediaFromUrl } from "../outbound-media-V1H6_xDA.js";
import { n as resolveThreadBindingFarewellText } from "../thread-bindings-messages-CJJcCl2_.js";
import { l as resolveThreadBindingMaxAgeMsForChannel, o as resolveThreadBindingIdleTimeoutMsForChannel } from "../thread-bindings-policy-DvMZHdEA.js";
import { t as chunkTextForOutbound } from "../text-chunking-lDajLZMN.js";
import "../channel-plugin-common-PtaCHe3b.js";
import { n as toLocationContext, t as formatLocationText } from "../location-DAojCg0Y.js";
import { n as setMatrixThreadBindingMaxAgeBySessionKey, t as setMatrixThreadBindingIdleTimeoutBySessionKey } from "../matrix-thread-bindings-DxBcbv6P.js";
import { a as resolveMatrixAccountStorageRoot, c as resolveMatrixCredentialsPath, i as resolveConfiguredMatrixAccountIds, l as resolveMatrixDefaultOrOnlyAccountId, n as getMatrixScopedEnvVarNames, o as resolveMatrixChannelConfig, r as requiresExplicitMatrixDefaultAccount, s as resolveMatrixCredentialsDir, t as findMatrixAccountEntry, u as resolveMatrixLegacyFlatStoragePaths } from "../matrix-helper-Dn1qt5yJ.js";
import { n as setMatrixRuntime, t as resolveMatrixAccountStringValues } from "../matrix-runtime-surface-Cvqzbq0Y.js";
import { r as resetMatrixThreadBindingsForTests, t as createMatrixThreadBindingManager } from "../matrix-surface-Z9jNCbmi.js";
//#region src/plugin-sdk/matrix.ts
function loadMatrixFacadeModule() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "matrix",
		artifactBasename: "contract-api.js"
	});
}
const singleAccountKeysToMove = createLazyFacadeArrayValue(() => loadMatrixFacadeModule().singleAccountKeysToMove);
const namedAccountPromotionKeys = createLazyFacadeArrayValue(() => loadMatrixFacadeModule().namedAccountPromotionKeys);
const resolveSingleAccountPromotionTarget = ((...args) => loadMatrixFacadeModule().resolveSingleAccountPromotionTarget(...args));
const matrixSetup = createOptionalChannelSetupSurface({
	channel: "matrix",
	label: "Matrix",
	npmSpec: "@openclaw/matrix",
	docsPath: "/channels/matrix"
});
const matrixSetupWizard = matrixSetup.setupWizard;
const matrixSetupAdapter = matrixSetup.setupAdapter;
//#endregion
export { DEFAULT_ACCOUNT_ID, GROUP_POLICY_BLOCKED_LABEL, MarkdownConfigSchema, PAIRING_APPROVED_MESSAGE, ToolPolicySchema, addAllowlistUserEntriesFromConfigEntry, addWildcardAllowFrom, applyAccountNameToChannelSection, buildAllowlistResolutionSummary, buildChannelConfigSchema, buildChannelKeyCandidates, buildComputedAccountStatusSnapshot, buildProbeChannelStatusSummary, buildSecretInputSchema, buildSingleChannelSecretPromptState, canonicalizeAllowlistWithResolvedIds, chunkTextForOutbound, collectStatusIssuesFromLastError, compileAllowlist, createAccountListHelpers, createActionGate, createChannelPairingController, createChannelReplyPipeline, createLoggerBackedRuntime, createMatrixThreadBindingManager, createReplyPrefixOptions, createTypingCallbacks, deleteAccountFromConfigSection, emptyPluginConfigSchema, evaluateGroupRouteAccessForPolicy, fetchWithSsrFGuard, findMatrixAccountEntry, formatAllowlistMatchMeta, formatDocsLink, formatLocationText, formatPairingApproveHint, formatResolvedUnresolvedNote, formatZonedTimestamp, getAgentScopedMediaLocalRoots, getChatChannelMeta, getMatrixScopedEnvVarNames, getSessionBindingService, hasConfiguredSecretInput, isPrivateOrLoopbackHost, jsonResult, loadOutboundMediaFromUrl, logInboundDrop, logTypingFailure, matrixSetupAdapter, matrixSetupWizard, mergeAllowFromEntries, mergeAllowlist, moveSingleAccountChannelSectionToDefaultAccount, namedAccountPromotionKeys, normalizeAccountId, normalizeOptionalAccountId, normalizePollInput, normalizeResolvedSecretInputString, normalizeSecretInputString, normalizeStringEntries, patchAllowlistUsersInConfigEntries, promptAccountId, promptChannelAccessConfig, promptSingleChannelSecretInput, readJsonFileWithFallback, readNumberParam, readReactionParams, readStringArrayParam, readStringParam, redactSensitiveText, registerSessionBindingAdapter, requiresExplicitMatrixDefaultAccount, resetMatrixThreadBindingsForTests, resolveAckReaction, resolveAgentIdFromSessionKey, resolveAllowlistCandidates, resolveAllowlistMatchByCandidates, resolveAllowlistProviderRuntimeGroupPolicy, resolveChannelEntryMatch, resolveCompiledAllowlistMatch, resolveConfiguredMatrixAccountIds, resolveControlCommandGate, resolveDefaultGroupPolicy, resolveMatrixAccountStorageRoot, resolveMatrixAccountStringValues, resolveMatrixChannelConfig, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, resolveMatrixDefaultOrOnlyAccountId, resolveMatrixLegacyFlatStoragePaths, resolveOutboundSendDep, resolveRuntimeEnv, resolveSenderScopedGroupPolicy, resolveSingleAccountPromotionTarget, resolveThreadBindingFarewellText, resolveThreadBindingIdleTimeoutMsForChannel, resolveThreadBindingMaxAgeMsForChannel, runPluginCommandWithTimeout, setAccountEnabledInConfigSection, setMatrixRuntime, setMatrixThreadBindingIdleTimeoutBySessionKey, setMatrixThreadBindingMaxAgeBySessionKey, setTopLevelChannelGroupPolicy, singleAccountKeysToMove, summarizeMapping, toLocationContext, unregisterSessionBindingAdapter, warnMissingProviderGroupPolicyFallbackOnce, writeJsonFileAtomically };
