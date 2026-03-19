import type { ClawdbotConfig } from "../runtime-api.js";
export declare function resolveFeishuSendTarget(params: {
    cfg: ClawdbotConfig;
    to: string;
    accountId?: string;
}): {
    client: Lark.Client;
    receiveId: string;
    receiveIdType: "chat_id" | "open_id" | "user_id";
};
