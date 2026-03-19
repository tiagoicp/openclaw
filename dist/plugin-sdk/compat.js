import "../logger-Qep7Kkk8.js";
import "../paths-C--RM-nt.js";
import "../tmp-openclaw-dir-DHiu0fYi.js";
import "../theme-CWrxY1-_.js";
import "../globals-ir4cuPXg.js";
import "../subsystem-DZirmh0Z.js";
import "../ansi-cwY8Vrne.js";
import "../utils-DHW4u72m.js";
import "../agent-scope-CjT_nq79.js";
import "../boundary-path-C6aAhZ_Z.js";
import "../boundary-file-read-C_4eDsgv.js";
import "../logger-Cpn1HYqp.js";
import "../exec-CmLTXzPB.js";
import "../workspace-v-lU9b6K.js";
import "../registry-B1w4aWmD.js";
import { a as DmPolicySchema, c as GroupPolicySchema, m as MarkdownConfigSchema } from "../zod-schema.core-Ck0QyHFp.js";
import "../file-lock-DinRPZjC.js";
import "../registry-DLX6vbqC.js";
import "../plugins-IaWBZ3jI.js";
import { t as emptyPluginConfigSchema } from "../config-schema-ZDf-BouG.js";
import { i as buildNestedDmConfigSchema, n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "../config-schema-DxpGRv8-.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-BkrbtWih.js";
import { a as listDirectoryUserEntriesFromAllowFrom, i as listDirectoryGroupEntriesFromMapKeysAndAllowFrom, n as collectNormalizedDirectoryIds, o as listDirectoryUserEntriesFromAllowFromAndMapKeys, r as listDirectoryGroupEntriesFromMapKeys, s as toDirectoryEntries, t as applyDirectoryQueryAndLimit } from "../directory-runtime-B1TX8_Zv.js";
import { t as inspectReadOnlyChannelAccount } from "../read-only-account-inspect-xHvglWTH.js";
import { a as collectAllowlistProviderRestrictSendersWarnings, c as collectOpenGroupPolicyRouteAllowlistWarnings, i as collectAllowlistProviderGroupPolicyWarnings, l as collectOpenProviderGroupPolicyWarnings, n as buildOpenGroupPolicyRestrictSendersWarning, r as buildOpenGroupPolicyWarning, s as collectOpenGroupPolicyRestrictSendersWarnings, t as buildOpenGroupPolicyConfigureRouteAllowlistWarning } from "../group-policy-warnings-YpdU_Yps.js";
import { a as createScopedChannelConfigBase, c as createTopLevelChannelConfigBase, d as mapAllowFromEntries, i as createScopedChannelConfigAdapter, n as createHybridChannelConfigBase, o as createScopedDmSecurityResolver, r as createScopedAccountConfigAccessors, s as createTopLevelChannelConfigAdapter, t as createHybridChannelConfigAdapter } from "../channel-config-helpers-BRtPQkQ4.js";
import { i as resolveToolsBySender, n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "../channel-policy-D36XRAGP.js";
import { n as readStoreAllowFromForDmPolicy, o as resolveDmGroupAccessWithLists, s as resolveEffectiveAllowFromLists, t as DM_GROUP_ACCESS_REASON, u as resolveControlCommandGate } from "../dm-policy-shared-DemT0SXY.js";
import "../pairing-store-CHd7RYjk.js";
import "../json-store-Bry0kHU6.js";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-gmtlUQkB.js";
import { t as delegateCompactionToRuntime } from "../delegate-CWt-W_4V.js";
import { a as buildHistoryContext, c as buildPendingHistoryContextFromMap, d as evictOldHistoryKeys, f as recordPendingHistoryEntry, l as clearHistoryEntries, o as buildHistoryContextFromEntries, p as recordPendingHistoryEntryIfEnabled, s as buildHistoryContextFromMap, t as DEFAULT_GROUP_HISTORY_LIMIT, u as clearHistoryEntriesIfEnabled } from "../history-BwTruWhS.js";
import { n as formatNormalizedAllowFromEntries, t as formatAllowFromLowercase } from "../allow-from-C9ReJ-iQ.js";
import "../shared-BTjSaeGP.js";
import { t as createAccountStatusSink } from "../channel-lifecycle-BZNpIQbC.js";
import { t as createPluginRuntimeStore } from "../runtime-store-ChPMsBuD.js";
import "../channel-config-schema-Cw16XVdS.js";
import "../reply-history-Def2D35Q.js";
import { t as mapAllowlistResolutionInputs } from "../allowlist-resolution-G-c5xSFT.js";
import { n as resolveBlueBubblesGroupRequireMention, r as resolveBlueBubblesGroupToolPolicy, t as collectBlueBubblesStatusIssues } from "../bluebubbles-BcukXVyX.js";
//#region src/plugin-sdk/compat.ts
if (process.env.VITEST !== "true" && process.env.OPENCLAW_SUPPRESS_PLUGIN_SDK_COMPAT_WARNING !== "1") process.emitWarning("openclaw/plugin-sdk/compat is deprecated for new plugins. Migrate to focused openclaw/plugin-sdk/<subpath> imports.", {
	code: "OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED",
	detail: "Bundled plugins must use scoped plugin-sdk subpaths. External plugins may keep compat temporarily while migrating."
});
//#endregion
export { AllowFromListSchema, DEFAULT_GROUP_HISTORY_LIMIT, DM_GROUP_ACCESS_REASON, DmPolicySchema, GroupPolicySchema, KeyedAsyncQueue, MarkdownConfigSchema, applyDirectoryQueryAndLimit, buildAccountScopedDmSecurityPolicy, buildCatchallMultiAccountChannelSchema, buildChannelConfigSchema, buildHistoryContext, buildHistoryContextFromEntries, buildHistoryContextFromMap, buildNestedDmConfigSchema, buildOpenGroupPolicyConfigureRouteAllowlistWarning, buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, buildPendingHistoryContextFromMap, clearHistoryEntries, clearHistoryEntriesIfEnabled, collectAllowlistProviderGroupPolicyWarnings, collectAllowlistProviderRestrictSendersWarnings, collectBlueBubblesStatusIssues, collectNormalizedDirectoryIds, collectOpenGroupPolicyRestrictSendersWarnings, collectOpenGroupPolicyRouteAllowlistWarnings, collectOpenProviderGroupPolicyWarnings, createAccountStatusSink, createHybridChannelConfigAdapter, createHybridChannelConfigBase, createPluginRuntimeStore, createScopedAccountConfigAccessors, createScopedChannelConfigAdapter, createScopedChannelConfigBase, createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter, createTopLevelChannelConfigBase, delegateCompactionToRuntime, emptyPluginConfigSchema, evictOldHistoryKeys, formatAllowFromLowercase, formatNormalizedAllowFromEntries, inspectReadOnlyChannelAccount, listDirectoryGroupEntriesFromMapKeys, listDirectoryGroupEntriesFromMapKeysAndAllowFrom, listDirectoryUserEntriesFromAllowFrom, listDirectoryUserEntriesFromAllowFromAndMapKeys, mapAllowFromEntries, mapAllowlistResolutionInputs, readStoreAllowFromForDmPolicy, recordPendingHistoryEntry, recordPendingHistoryEntryIfEnabled, resolveBlueBubblesGroupRequireMention, resolveBlueBubblesGroupToolPolicy, resolveChannelGroupRequireMention, resolveChannelGroupToolsPolicy, resolveControlCommandGate, resolveDmGroupAccessWithLists, resolveEffectiveAllowFromLists, resolveToolsBySender, toDirectoryEntries };
