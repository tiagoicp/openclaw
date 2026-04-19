import { r as buildChannelConfigSchema } from "../../config-schema-rBqVo6-O.js";
import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-CZtNSGs2.js";
import { r as IMessageConfigSchema } from "../../zod-schema.providers-core-B5o6Ezgb.js";
import { m as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-Da4M1Ru3.js";
import { o as getChatChannelMeta } from "../../core-veIgLISV.js";
import { t as createPluginRuntimeStore } from "../../runtime-store-C_guwbh9.js";
import { t as resolveChannelMediaMaxBytes } from "../../media-limits-DYdkyg_b.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-COPj1ZLj.js";
import { c as collectStatusIssuesFromLastError, r as buildComputedAccountStatusSnapshot } from "../../status-helpers-C-OjDvUo.js";
import "../../media-runtime-CiuGP4f2.js";
import { t as chunkTextForOutbound } from "../../text-chunking-lDajLZMN.js";
import "../../channel-status-Bz9FAEWe.js";
import { _ as resolveIMessageConfigAllowFrom, g as normalizeIMessageMessagingTarget, h as looksLikeIMessageTargetId, t as probeIMessage, v as resolveIMessageConfigDefaultTo } from "../../probe-DKJXW6jK.js";
import { n as resolveIMessageGroupToolPolicy, t as resolveIMessageGroupRequireMention } from "../../group-policy-DN6CA2ah.js";
import "../../config-api-eJjhCMqh.js";
import { n as sendMessageIMessage, t as monitorIMessageProvider } from "../../monitor-BShIsTlp.js";
//#region extensions/imessage/src/runtime.ts
const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } = createPluginRuntimeStore({
	pluginId: "imessage",
	errorMessage: "iMessage runtime not initialized"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
