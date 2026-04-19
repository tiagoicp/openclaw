import { u as normalizeE164 } from "../../utils-D5DtWkEu.js";
import { t as formatDocsLink } from "../../links-CX_lepoz.js";
import { t as formatCliCommand } from "../../command-format-Dd3uP9-6.js";
import { r as buildChannelConfigSchema } from "../../config-schema-rBqVo6-O.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-CZtNSGs2.js";
import { a as SignalConfigSchema } from "../../zod-schema.providers-core-B5o6Ezgb.js";
import { a as chunkText } from "../../chunk-BwGwtTwh.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "../../config-helpers-3aVyuY0F.js";
import "../../text-runtime-DHfI0VWF.js";
import { n as formatPairingApproveHint } from "../../helpers-CRMEpaC8.js";
import { n as emptyPluginConfigSchema } from "../../config-schema-3udNz-jR.js";
import { s as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../../setup-helpers-DxNOfWja.js";
import { o as getChatChannelMeta } from "../../core-w7kNLu40.js";
import { t as createPluginRuntimeStore } from "../../runtime-store-C_guwbh9.js";
import { n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "../../runtime-group-policy-CNY9C-RM.js";
import { t as resolveChannelMediaMaxBytes } from "../../media-limits-DYdkyg_b.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-COPj1ZLj.js";
import { c as collectStatusIssuesFromLastError, d as createDefaultChannelRuntimeState, n as buildBaseChannelStatusSummary, t as buildBaseAccountStatusSnapshot } from "../../status-helpers-C-OjDvUo.js";
import { t as detectBinary } from "../../detect-binary-DSgIkqfK.js";
import "../../setup-tools-GICNojNu.js";
import "../../config-runtime-svP9ZomL.js";
import "../../reply-runtime-CgaCg0nS.js";
import "../../media-runtime-BX5Edo-X.js";
import "../../channel-status-Bz9FAEWe.js";
import { i as resolveSignalAccount, n as listSignalAccountIds, r as resolveDefaultSignalAccountId, t as listEnabledSignalAccounts } from "../../accounts-DyyImrJQ.js";
import { d as looksLikeSignalTargetId, f as normalizeSignalMessagingTarget } from "../../identity-F33c7nek.js";
import { t as sendMessageSignal } from "../../send-KrtDoQAQ.js";
import { n as sendReactionSignal, t as removeReactionSignal } from "../../reaction-runtime-api-DzthbCVD.js";
import { n as resolveSignalReactionLevel, t as signalMessageActions } from "../../message-actions-DNUWkGLW.js";
import "../../config-api-oDqPlAp-.js";
import { n as installSignalCli } from "../../install-signal-cli-CKzG4FHA.js";
import { t as monitorSignalProvider } from "../../monitor-Dr9m9Ayj.js";
import { t as probeSignal } from "../../probe-B1Hkyjk0.js";
//#region extensions/signal/src/runtime.ts
const { setRuntime: setSignalRuntime, clearRuntime: clearSignalRuntime, getRuntime: getSignalRuntime } = createPluginRuntimeStore({
	pluginId: "signal",
	errorMessage: "Signal runtime not initialized"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, PAIRING_APPROVED_MESSAGE, SignalConfigSchema, applyAccountNameToChannelSection, buildBaseAccountStatusSnapshot, buildBaseChannelStatusSummary, buildChannelConfigSchema, chunkText, collectStatusIssuesFromLastError, createDefaultChannelRuntimeState, deleteAccountFromConfigSection, detectBinary, emptyPluginConfigSchema, formatCliCommand, formatDocsLink, formatPairingApproveHint, getChatChannelMeta, installSignalCli, listEnabledSignalAccounts, listSignalAccountIds, looksLikeSignalTargetId, migrateBaseNameToDefaultAccount, monitorSignalProvider, normalizeAccountId, normalizeE164, normalizeSignalMessagingTarget, probeSignal, removeReactionSignal, resolveAllowlistProviderRuntimeGroupPolicy, resolveChannelMediaMaxBytes, resolveDefaultGroupPolicy, resolveDefaultSignalAccountId, resolveSignalAccount, resolveSignalReactionLevel, sendMessageSignal, sendReactionSignal, setAccountEnabledInConfigSection, setSignalRuntime, signalMessageActions };
