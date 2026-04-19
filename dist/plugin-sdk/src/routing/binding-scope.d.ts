export type RouteBindingScopeConstraint = {
    guildId?: string | null;
    teamId?: string | null;
    roles?: string[] | null;
};
export type RouteBindingScope = {
    guildId?: string | null;
    teamId?: string | null;
    groupSpace?: string | null;
    memberRoleIds?: Iterable<string> | null;
};
export declare function normalizeRouteBindingId(value: unknown): string;
export declare function normalizeRouteBindingRoles(value: string[] | null | undefined): string[] | null;
export declare function routeBindingScopeMatches(constraint: RouteBindingScopeConstraint, scope: RouteBindingScope): boolean;
