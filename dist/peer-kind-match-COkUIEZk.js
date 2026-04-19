//#region src/routing/binding-scope.ts
function normalizeRouteBindingId(value) {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number" || typeof value === "bigint") return String(value).trim();
	return "";
}
function normalizeRouteBindingRoles(value) {
	return Array.isArray(value) && value.length > 0 ? value : null;
}
function scopeIdMatches(params) {
	if (!params.constraint) return true;
	return params.constraint === params.exact || params.constraint === params.groupSpace;
}
function hasRoleLookup(memberRoleIds) {
	return typeof memberRoleIds.has === "function";
}
function hasAnyRouteBindingRole(roles, memberRoleIds) {
	if (!memberRoleIds) return false;
	if (hasRoleLookup(memberRoleIds)) return roles.some((role) => memberRoleIds.has(role));
	const memberRoleIdSet = new Set(memberRoleIds);
	return roles.some((role) => memberRoleIdSet.has(role));
}
function routeBindingScopeMatches(constraint, scope) {
	const guildId = normalizeRouteBindingId(scope.guildId);
	const teamId = normalizeRouteBindingId(scope.teamId);
	const groupSpace = normalizeRouteBindingId(scope.groupSpace);
	if (!scopeIdMatches({
		constraint: constraint.guildId,
		exact: guildId,
		groupSpace
	})) return false;
	if (!scopeIdMatches({
		constraint: constraint.teamId,
		exact: teamId,
		groupSpace
	})) return false;
	const roles = normalizeRouteBindingRoles(constraint.roles);
	if (!roles) return true;
	return hasAnyRouteBindingRole(roles, scope.memberRoleIds);
}
//#endregion
//#region src/routing/peer-kind-match.ts
function peerKindMatches(bindingKind, scopeKind) {
	if (bindingKind === scopeKind) return true;
	return bindingKind === "group" && scopeKind === "channel" || bindingKind === "channel" && scopeKind === "group";
}
//#endregion
export { routeBindingScopeMatches as i, normalizeRouteBindingId as n, normalizeRouteBindingRoles as r, peerKindMatches as t };
