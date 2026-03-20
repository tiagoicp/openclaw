import "../logger-Bisu6sgz.js";
import "../paths-D_QmduAc.js";
import "../tmp-openclaw-dir-CEAo8CGE.js";
import "../theme-Bnch_o1K.js";
import "../globals-CnsLPQis.js";
import "../subsystem-Dm-AQqmI.js";
import "../ansi-BMqrB9En.js";
import "../utils-CIAfMgvq.js";
import "../agent-scope-BvOTVsJZ.js";
import "../boundary-path-BVHzCDEE.js";
import "../boundary-file-read-1knRHcS0.js";
import "../logger-DcSg74GU.js";
import "../exec-Bwz57vWc.js";
import "../workspace-C3BQkKrq.js";
import "../registry-DHFXbGRB.js";
import { a as DmPolicySchema, c as GroupPolicySchema, m as MarkdownConfigSchema } from "../zod-schema.core-2nNLrIvV.js";
import "../file-lock-BCRwTnvL.js";
import "../registry-u4-bSC0t.js";
import "../plugins-CrRqO64r.js";
import { t as emptyPluginConfigSchema } from "../config-schema-C7CLvRZd.js";
import { i as buildNestedDmConfigSchema, n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "../config-schema-SbU9iMOP.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-7HrxcRQR.js";
import { a as listDirectoryUserEntriesFromAllowFrom, i as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, n as collectNormalizedDirectoryIds, o as listDirectoryUserEntriesFromAllowFromAndMapKeys, r as listDirectoryGroupEntriesFromMapKeys, s as toDirectoryEntries, t as applyDirectoryQueryAndLimit } from "../directory-runtime-4Kx3Gvfd.js";
import { t as inspectReadOnlyChannelAccount } from "../read-only-account-inspect-BzQtVN0P.js";
import { a as collectAllowlistProviderRestrictSendersWarnings, c as collectOpenGroupPolicyRouteAllowlistWarnings, i as collectAllowlistProviderGroupPolicyWarnings, l as collectOpenProviderGroupPolicyWarnings, n as buildOpenGroupPolicyRestrictSendersWarning, r as buildOpenGroupPolicyWarning, s as collectOpenGroupPolicyRestrictSendersWarnings, t as buildOpenGroupPolicyConfigureRouteAllowlistWarning } from "../group-policy-warnings-BpL6kBOR.js";
import { a as createScopedChannelConfigBase, c as createTopLevelChannelConfigBase, d as mapAllowFromEntries, i as createScopedChannelConfigAdapter, n as createHybridChannelConfigBase, o as createScopedDmSecurityResolver, r as createScopedAccountConfigAccessors, s as createTopLevelChannelConfigAdapter, t as createHybridChannelConfigAdapter } from "../channel-config-helpers-DgtPbGwx.js";
import { i as resolveToolsBySender, n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "../channel-policy-DpLpqCrB.js";
import { n as readStoreAllowFromForDmPolicy, o as resolveDmGroupAccessWithLists, s as resolveEffectiveAllowFromLists, t as DM_GROUP_ACCESS_REASON, u as resolveControlCommandGate } from "../dm-policy-shared-DR-r8JQl.js";
import "../pairing-store-BqbEmTVQ.js";
import "../json-store-BlJH8v0x.js";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-DUSLUbqW.js";
import { t as delegateCompactionToRuntime } from "../delegate-DZgF1n1_.js";
import { a as buildHistoryContext, c as buildPendingHistoryContextFromMap, d as evictOldHistoryKeys, f as recordPendingHistoryEntry, l as clearHistoryEntries, o as buildHistoryContextFromEntries, p as recordPendingHistoryEntryIfEnabled, s as buildHistoryContextFromMap, t as DEFAULT_GROUP_HISTORY_LIMIT, u as clearHistoryEntriesIfEnabled } from "../history-CZuN-T_-.js";
import { n as formatNormalizedAllowFromEntries, t as formatAllowFromLowercase } from "../allow-from-DoBojQVl.js";
import "../shared-TeMeV5_s.js";
import { t as createAccountStatusSink } from "../channel-lifecycle-DdXz2fSX.js";
import { t as createPluginRuntimeStore } from "../runtime-store-CQh9xP4Y.js";
import "../channel-config-schema-BwkXi_Au.js";
import "../reply-history-DjxtPUhH.js";
import { t as mapAllowlistResolutionInputs } from "../allowlist-resolution-CWZcZtF7.js";
import { n as resolveBlueBubblesGroupRequireMention, r as resolveBlueBubblesGroupToolPolicy, t as collectBlueBubblesStatusIssues } from "../bluebubbles-C46VBlZV.js";
//#region src/plugin-sdk/compat.ts
if (process.env.VITEST !== "true" && process.env.OPENCLAW_SUPPRESS_PLUGIN_SDK_COMPAT_WARNING !== "1") process.emitWarning("openclaw/plugin-sdk/compat is deprecated for new plugins. Migrate to focused openclaw/plugin-sdk/<subpath> imports.", {
	code: "OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED",
	detail: "Bundled plugins must use scoped plugin-sdk subpaths. External plugins may keep compat temporarily while migrating."
});
//#endregion
export { AllowFromListSchema, DEFAULT_GROUP_HISTORY_LIMIT, DM_GROUP_ACCESS_REASON, DmPolicySchema, GroupPolicySchema, KeyedAsyncQueue, MarkdownConfigSchema, applyDirectoryQueryAndLimit, buildAccountScopedDmSecurityPolicy, buildCatchallMultiAccountChannelSchema, buildChannelConfigSchema, buildHistoryContext, buildHistoryContextFromEntries, buildHistoryContextFromMap, buildNestedDmConfigSchema, buildOpenGroupPolicyConfigureRouteAllowlistWarning, buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, buildPendingHistoryContextFromMap, clearHistoryEntries, clearHistoryEntriesIfEnabled, collectAllowlistProviderGroupPolicyWarnings, collectAllowlistProviderRestrictSendersWarnings, collectBlueBubblesStatusIssues, collectNormalizedDirectoryIds, collectOpenGroupPolicyRestrictSendersWarnings, collectOpenGroupPolicyRouteAllowlistWarnings, collectOpenProviderGroupPolicyWarnings, createAccountStatusSink, createHybridChannelConfigAdapter, createHybridChannelConfigBase, createPluginRuntimeStore, createScopedAccountConfigAccessors, createScopedChannelConfigAdapter, createScopedChannelConfigBase, createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter, createTopLevelChannelConfigBase, delegateCompactionToRuntime, emptyPluginConfigSchema, evictOldHistoryKeys, formatAllowFromLowercase, formatNormalizedAllowFromEntries, inspectReadOnlyChannelAccount, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, mapAllowFromEntries, mapAllowlistResolutionInputs, readStoreAllowFromForDmPolicy, recordPendingHistoryEntry, recordPendingHistoryEntryIfEnabled, resolveBlueBubblesGroupRequireMention, resolveBlueBubblesGroupToolPolicy, resolveChannelGroupRequireMention, resolveChannelGroupToolsPolicy, resolveControlCommandGate, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveToolsBySender, toDirectoryEntries };
