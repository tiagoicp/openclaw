import { z } from "zod";
export declare const SecretRefSchema: any;
export declare const SecretInputSchema: any;
export declare const SecretProviderSchema: any;
export declare const SecretsConfigSchema: any;
export declare const ModelApiSchema: any;
export declare const ModelCompatSchema: any;
export declare const ModelDefinitionSchema: any;
export declare const ModelProviderSchema: any;
export declare const BedrockDiscoverySchema: any;
export declare const ModelsConfigSchema: any;
export declare const GroupChatSchema: any;
export declare const DmConfigSchema: any;
export declare const IdentitySchema: any;
export declare const QueueModeSchema: any;
export declare const QueueDropSchema: any;
export declare const ReplyToModeSchema: any;
export declare const TypingModeSchema: any;
export declare const GroupPolicySchema: any;
export declare const DmPolicySchema: any;
export declare const BlockStreamingCoalesceSchema: any;
export declare const ReplyRuntimeConfigSchemaShape: {
    historyLimit: any;
    dmHistoryLimit: any;
    dms: any;
    textChunkLimit: any;
    chunkMode: any;
    blockStreaming: any;
    blockStreamingCoalesce: any;
    responsePrefix: any;
    mediaMaxMb: any;
};
export declare const BlockStreamingChunkSchema: any;
export declare const MarkdownTableModeSchema: any;
export declare const MarkdownConfigSchema: any;
export declare const TtsProviderSchema: any;
export declare const TtsModeSchema: any;
export declare const TtsAutoSchema: any;
export declare const TtsConfigSchema: any;
export declare const HumanDelaySchema: any;
export declare const CliBackendSchema: any;
export declare const normalizeAllowFrom: (values?: Array<string | number>) => string[];
export declare const requireOpenAllowFrom: (params: {
    policy?: string;
    allowFrom?: Array<string | number>;
    ctx: z.RefinementCtx;
    path: Array<string | number>;
    message: string;
}) => void;
/**
 * Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
 * Without this, all DMs are silently dropped because the allowlist is empty
 * and no senders can match.
 */
export declare const requireAllowlistAllowFrom: (params: {
    policy?: string;
    allowFrom?: Array<string | number>;
    ctx: z.RefinementCtx;
    path: Array<string | number>;
    message: string;
}) => void;
export declare const MSTeamsReplyStyleSchema: any;
export declare const RetryConfigSchema: any;
export declare const QueueModeBySurfaceSchema: any;
export declare const DebounceMsBySurfaceSchema: any;
export declare const QueueSchema: any;
export declare const InboundDebounceSchema: any;
export declare const TranscribeAudioSchema: any;
export declare const HexColorSchema: any;
export declare const ExecutableTokenSchema: any;
export declare const MediaUnderstandingScopeSchema: any;
export declare const MediaUnderstandingCapabilitiesSchema: any;
export declare const MediaUnderstandingAttachmentsSchema: any;
export declare const MediaUnderstandingModelSchema: any;
export declare const ToolsMediaUnderstandingSchema: any;
export declare const ToolsMediaSchema: any;
export declare const LinkModelSchema: any;
export declare const ToolsLinksSchema: any;
export declare const NativeCommandsSettingSchema: any;
export declare const ProviderCommandsSchema: any;
