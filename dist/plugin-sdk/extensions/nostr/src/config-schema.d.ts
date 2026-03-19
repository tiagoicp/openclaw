import { z } from "zod";
/**
 * NIP-01 profile metadata schema
 * https://github.com/nostr-protocol/nips/blob/master/01.md
 */
export declare const NostrProfileSchema: any;
export type NostrProfile = z.infer<typeof NostrProfileSchema>;
/**
 * Zod schema for channels.nostr.* configuration
 */
export declare const NostrConfigSchema: any;
export type NostrConfig = z.infer<typeof NostrConfigSchema>;
/**
 * JSON Schema for Control UI (converted from Zod)
 */
export declare const nostrChannelConfigSchema: import("openclaw/plugin-sdk").ChannelConfigSchema;
