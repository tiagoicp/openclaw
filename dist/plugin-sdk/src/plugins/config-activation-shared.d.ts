type EnableStateLike = {
    enabled: boolean;
    reason?: string;
};
type EnableStateParamsLike = {
    id: string;
    origin: string;
    config: unknown;
    enabledByDefault?: boolean;
};
type PluginKindLike = string | readonly string[] | undefined;
export declare function toEnableStateResult(state: EnableStateLike): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveEnableStateResult<TParams>(params: TParams, resolveState: (params: TParams) => EnableStateLike): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveEnableStateShared<TParams extends EnableStateParamsLike>(params: TParams, resolveState: (params: TParams) => EnableStateLike): {
    enabled: boolean;
    reason?: string;
};
export declare function resolveMemorySlotDecisionShared(params: {
    id: string;
    kind?: PluginKindLike;
    slot: string | null | undefined;
    selectedId: string | null;
}): {
    enabled: boolean;
    reason?: string;
    selected?: boolean;
};
export {};
