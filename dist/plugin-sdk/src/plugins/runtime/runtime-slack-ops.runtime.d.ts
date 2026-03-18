import { listSlackDirectoryGroupsLive as listSlackDirectoryGroupsLiveImpl, listSlackDirectoryPeersLive as listSlackDirectoryPeersLiveImpl } from "../../../extensions/slack/runtime-api.js";
import { monitorSlackProvider as monitorSlackProviderImpl } from "../../../extensions/slack/runtime-api.js";
import { probeSlack as probeSlackImpl } from "../../../extensions/slack/runtime-api.js";
import { resolveSlackChannelAllowlist as resolveSlackChannelAllowlistImpl } from "../../../extensions/slack/runtime-api.js";
import { resolveSlackUserAllowlist as resolveSlackUserAllowlistImpl } from "../../../extensions/slack/runtime-api.js";
import { sendMessageSlack as sendMessageSlackImpl } from "../../../extensions/slack/runtime-api.js";
import { handleSlackAction as handleSlackActionImpl } from "../../../extensions/slack/runtime-api.js";
export declare const runtimeSlackOps: {
    listDirectoryGroupsLive: typeof listSlackDirectoryGroupsLiveImpl;
    listDirectoryPeersLive: typeof listSlackDirectoryPeersLiveImpl;
    probeSlack: typeof probeSlackImpl;
    resolveChannelAllowlist: typeof resolveSlackChannelAllowlistImpl;
    resolveUserAllowlist: typeof resolveSlackUserAllowlistImpl;
    sendMessageSlack: typeof sendMessageSlackImpl;
    monitorSlackProvider: typeof monitorSlackProviderImpl;
    handleSlackAction: typeof handleSlackActionImpl;
};
