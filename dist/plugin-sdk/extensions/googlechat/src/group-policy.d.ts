import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
type GoogleChatGroupContext = {
    cfg: OpenClawConfig;
    accountId?: string | null;
    groupId?: string | null;
};
export declare function resolveGoogleChatGroupRequireMention(params: GoogleChatGroupContext): boolean;
export {};
