/**
 * Twitch plugin configuration schema
 *
 * Supports two mutually exclusive patterns:
 * 1. Simplified single-account: username, accessToken, clientId, channel at top level
 * 2. Multi-account: accounts object with named account configs
 *
 * The union ensures clear discrimination between the two modes.
 */
export declare const TwitchConfigSchema: any;
