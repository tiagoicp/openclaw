import { type DirectoryConfigParams } from "openclaw/plugin-sdk/directory-runtime";
export declare function listWhatsAppDirectoryPeersFromConfig(params: DirectoryConfigParams): Promise<import("openclaw/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
export declare function listWhatsAppDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<import("openclaw/plugin-sdk/channel-runtime").ChannelDirectoryEntry[]>;
