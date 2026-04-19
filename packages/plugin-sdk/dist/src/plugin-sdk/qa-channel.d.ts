import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
export type QaBusConversationKind = "direct" | "channel";
export type QaBusConversation = {
    id: string;
    kind: QaBusConversationKind;
    title?: string;
};
export type QaBusAttachment = {
    id: string;
    kind: "image" | "video" | "audio" | "file";
    mimeType: string;
    fileName?: string;
    inline?: boolean;
    url?: string;
    contentBase64?: string;
    width?: number;
    height?: number;
    durationMs?: number;
    altText?: string;
    transcript?: string;
};
export type QaBusMessage = {
    id: string;
    accountId: string;
    direction: "inbound" | "outbound";
    conversation: QaBusConversation;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp: number;
    threadId?: string;
    threadTitle?: string;
    replyToId?: string;
    deleted?: boolean;
    editedAt?: number;
    attachments?: QaBusAttachment[];
    reactions: Array<{
        emoji: string;
        senderId: string;
        timestamp: number;
    }>;
};
export type QaBusThread = {
    id: string;
    accountId: string;
    conversationId: string;
    title: string;
    createdAt: number;
    createdBy: string;
};
export type QaBusEvent = {
    cursor: number;
    kind: "inbound-message";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "outbound-message";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "thread-created";
    accountId: string;
    thread: QaBusThread;
} | {
    cursor: number;
    kind: "message-edited";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "message-deleted";
    accountId: string;
    message: QaBusMessage;
} | {
    cursor: number;
    kind: "reaction-added";
    accountId: string;
    message: QaBusMessage;
    emoji: string;
    senderId: string;
};
export type QaBusInboundMessageInput = {
    accountId?: string;
    conversation: QaBusConversation;
    senderId: string;
    senderName?: string;
    text: string;
    timestamp?: number;
    threadId?: string;
    threadTitle?: string;
    replyToId?: string;
    attachments?: QaBusAttachment[];
};
export type QaBusOutboundMessageInput = {
    accountId?: string;
    to: string;
    senderId?: string;
    senderName?: string;
    text: string;
    timestamp?: number;
    threadId?: string;
    replyToId?: string;
    attachments?: QaBusAttachment[];
};
export type QaBusCreateThreadInput = {
    accountId?: string;
    conversationId: string;
    title: string;
    createdBy?: string;
    timestamp?: number;
};
export type QaBusReactToMessageInput = {
    accountId?: string;
    messageId: string;
    emoji: string;
    senderId?: string;
    timestamp?: number;
};
export type QaBusEditMessageInput = {
    accountId?: string;
    messageId: string;
    text: string;
    timestamp?: number;
};
export type QaBusDeleteMessageInput = {
    accountId?: string;
    messageId: string;
    timestamp?: number;
};
export type QaBusSearchMessagesInput = {
    accountId?: string;
    query?: string;
    conversationId?: string;
    threadId?: string;
    limit?: number;
};
export type QaBusReadMessageInput = {
    accountId?: string;
    messageId: string;
};
export type QaBusPollInput = {
    accountId?: string;
    cursor?: number;
    timeoutMs?: number;
    limit?: number;
};
export type QaBusPollResult = {
    cursor: number;
    events: QaBusEvent[];
};
export type QaBusStateSnapshot = {
    cursor: number;
    conversations: QaBusConversation[];
    threads: QaBusThread[];
    messages: QaBusMessage[];
    events: QaBusEvent[];
};
export type QaBusWaitForInput = {
    timeoutMs?: number;
    kind: "event-kind";
    eventKind: QaBusEvent["kind"];
} | {
    timeoutMs?: number;
    kind: "message-text";
    textIncludes: string;
    direction?: QaBusMessage["direction"];
} | {
    timeoutMs?: number;
    kind: "thread-id";
    threadId: string;
};
type QaTargetParts = {
    chatType: "direct" | "channel";
    conversationId: string;
    threadId?: string;
};
type FacadeModule = {
    buildQaTarget: (params: QaTargetParts & {
        threadId?: string | null;
    }) => string;
    formatQaTarget: (params: QaTargetParts & {
        threadId?: string | null;
    }) => string;
    createQaBusThread: (params: {
        baseUrl: string;
        accountId: string;
        conversationId: string;
        title: string;
        createdBy?: string;
    }) => Promise<{
        thread: QaBusThread;
    }>;
    deleteQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    editQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
        text: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    getQaBusState: (baseUrl: string) => Promise<QaBusStateSnapshot>;
    injectQaBusInboundMessage: (params: {
        baseUrl: string;
        input: QaBusInboundMessageInput;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    normalizeQaTarget: (raw: string) => string | undefined;
    parseQaTarget: (raw: string) => QaTargetParts;
    pollQaBus: (params: {
        baseUrl: string;
        accountId: string;
        cursor: number;
        timeoutMs: number;
        signal?: AbortSignal;
    }) => Promise<QaBusPollResult>;
    qaChannelPlugin: ChannelPlugin;
    reactToQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
        emoji: string;
        senderId?: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    readQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        messageId: string;
    }) => Promise<{
        message: QaBusMessage;
    }>;
    searchQaBusMessages: (params: {
        baseUrl: string;
        input: QaBusSearchMessagesInput;
    }) => Promise<{
        messages: QaBusMessage[];
    }>;
    sendQaBusMessage: (params: {
        baseUrl: string;
        accountId: string;
        to: string;
        text: string;
        senderId?: string;
        senderName?: string;
        threadId?: string;
        replyToId?: string;
        attachments?: QaBusAttachment[];
    }) => Promise<{
        message: QaBusMessage;
    }>;
    setQaChannelRuntime: (runtime: unknown) => void;
};
export declare const buildQaTarget: FacadeModule["buildQaTarget"];
export declare const formatQaTarget: FacadeModule["buildQaTarget"];
export declare const createQaBusThread: FacadeModule["createQaBusThread"];
export declare const deleteQaBusMessage: FacadeModule["deleteQaBusMessage"];
export declare const editQaBusMessage: FacadeModule["editQaBusMessage"];
export declare const getQaBusState: FacadeModule["getQaBusState"];
export declare const injectQaBusInboundMessage: FacadeModule["injectQaBusInboundMessage"];
export declare const normalizeQaTarget: FacadeModule["normalizeQaTarget"];
export declare const parseQaTarget: FacadeModule["parseQaTarget"];
export declare const pollQaBus: FacadeModule["pollQaBus"];
export declare const qaChannelPlugin: FacadeModule["qaChannelPlugin"];
export declare const reactToQaBusMessage: FacadeModule["reactToQaBusMessage"];
export declare const readQaBusMessage: FacadeModule["readQaBusMessage"];
export declare const searchQaBusMessages: FacadeModule["searchQaBusMessages"];
export declare const sendQaBusMessage: FacadeModule["sendQaBusMessage"];
export declare const setQaChannelRuntime: FacadeModule["setQaChannelRuntime"];
export {};
