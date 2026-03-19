import { type ZodTypeAny } from "zod";
import type { ChannelConfigSchema } from "./types.plugin.js";
type ExtendableZodObject = ZodTypeAny & {
    extend: (shape: Record<string, ZodTypeAny>) => ZodTypeAny;
};
export declare const AllowFromEntrySchema: any;
export declare const AllowFromListSchema: any;
export declare function buildNestedDmConfigSchema(): any;
export declare function buildCatchallMultiAccountChannelSchema<T extends ExtendableZodObject>(accountSchema: T): T;
export declare function buildChannelConfigSchema(schema: ZodTypeAny): ChannelConfigSchema;
export {};
