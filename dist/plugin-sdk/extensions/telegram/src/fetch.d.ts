import type { TelegramNetworkConfig } from "openclaw/plugin-sdk/config-runtime";
import { type PinnedDispatcherPolicy } from "openclaw/plugin-sdk/infra-runtime";
type TelegramDispatcherAttempt = {
    dispatcherPolicy?: PinnedDispatcherPolicy;
};
export declare function shouldRetryTelegramTransportFallback(err: unknown): boolean;
export type TelegramTransport = {
    fetch: typeof fetch;
    sourceFetch: typeof fetch;
    dispatcherAttempts?: TelegramDispatcherAttempt[];
};
export declare function resolveTelegramTransport(proxyFetch?: typeof fetch, options?: {
    network?: TelegramNetworkConfig;
}): TelegramTransport;
export declare function resolveTelegramFetch(proxyFetch?: typeof fetch, options?: {
    network?: TelegramNetworkConfig;
}): typeof fetch;
export {};
