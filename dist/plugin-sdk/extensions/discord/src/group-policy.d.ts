import { type GroupToolPolicyConfig } from "openclaw/plugin-sdk/channel-policy";
import { type ChannelGroupContext } from "openclaw/plugin-sdk/channel-runtime";
export declare function resolveDiscordGroupRequireMention(params: ChannelGroupContext): boolean;
export declare function resolveDiscordGroupToolPolicy(params: ChannelGroupContext): GroupToolPolicyConfig | undefined;
