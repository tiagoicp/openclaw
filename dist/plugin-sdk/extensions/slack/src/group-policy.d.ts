import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
import { type ChannelGroupContext } from "openclaw/plugin-sdk/channel-runtime";
export declare function resolveSlackGroupRequireMention(params: ChannelGroupContext): boolean;
export declare function resolveSlackGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
