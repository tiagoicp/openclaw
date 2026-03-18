import { type DirectoryConfigParams } from "openclaw/plugin-sdk/directory-runtime";
export declare function listDiscordDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("openclaw/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listDiscordDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("openclaw/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
