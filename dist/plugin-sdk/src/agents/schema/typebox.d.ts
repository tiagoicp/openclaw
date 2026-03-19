type StringEnumOptions<T extends readonly string[]> = {
    description?: string;
    title?: string;
    default?: T[number];
};
export declare function stringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): any;
export declare function optionalStringEnum<T extends readonly string[]>(values: T, options?: StringEnumOptions<T>): any;
export declare function channelTargetSchema(options?: {
    description?: string;
}): any;
export declare function channelTargetsSchema(options?: {
    description?: string;
}): any;
export {};
