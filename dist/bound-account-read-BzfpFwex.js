import { i as normalizeLowercaseStringOrEmpty } from "./string-coerce-BUSzWgUA.js";
import { r as normalizeChatChannelId } from "./ids-CMOTfTrB.js";
import { c as normalizeAgentId } from "./session-key-DO1ve_TS.js";
import { n as normalizeAccountId } from "./account-id-CZtNSGs2.js";
import { t as normalizeChatType } from "./chat-type-CblNWkor.js";
import { i as listRouteBindings } from "./bindings-BHSR4nGH.js";
import { i as routeBindingScopeMatches, n as normalizeRouteBindingId, r as normalizeRouteBindingRoles, t as peerKindMatches } from "./peer-kind-match-COkUIEZk.js";
//#region src/routing/bound-account-read.ts
function normalizeBindingChannelId(raw) {
	const normalized = normalizeChatChannelId(raw);
	if (normalized) return normalized;
	return normalizeLowercaseStringOrEmpty(raw) || null;
}
function resolveNormalizedBindingMatch(binding) {
	if (!binding || typeof binding !== "object") return null;
	const match = binding.match;
	if (!match || typeof match !== "object") return null;
	const channelId = normalizeBindingChannelId(match.channel);
	if (!channelId) return null;
	const accountId = typeof match.accountId === "string" ? match.accountId.trim() : "";
	if (!accountId || accountId === "*") return null;
	const peerId = match.peer && typeof match.peer.id === "string" ? match.peer.id.trim() : void 0;
	const peerKind = match.peer ? normalizeChatType(match.peer.kind) : void 0;
	return {
		agentId: normalizeAgentId(binding.agentId),
		accountId: normalizeAccountId(accountId),
		channelId,
		peerId: peerId || void 0,
		peerKind: peerKind ?? void 0,
		guildId: normalizeRouteBindingId(match.guildId) || null,
		teamId: normalizeRouteBindingId(match.teamId) || null,
		roles: normalizeRouteBindingRoles(match.roles)
	};
}
function buildExactPeerIdSet(params) {
	const exactPeerIds = /* @__PURE__ */ new Set();
	const peerId = params.peerId?.trim();
	if (peerId) exactPeerIds.add(peerId);
	for (const alias of params.exactPeerIdAliases ?? []) {
		const trimmed = alias.trim();
		if (trimmed) exactPeerIds.add(trimmed);
	}
	return exactPeerIds;
}
function resolveFirstBoundAccountId(params) {
	const normalizedChannel = normalizeBindingChannelId(params.channelId);
	if (!normalizedChannel) return;
	const normalizedAgentId = normalizeAgentId(params.agentId);
	const exactPeerIds = buildExactPeerIdSet({
		peerId: params.peerId?.trim() || void 0,
		exactPeerIdAliases: params.exactPeerIdAliases
	});
	const hasPeerContext = exactPeerIds.size > 0;
	const normalizedPeerKind = normalizeChatType(params.peerKind) ?? void 0;
	let wildcardPeerMatch;
	let channelOnlyFallback;
	for (const binding of listRouteBindings(params.cfg)) {
		const resolved = resolveNormalizedBindingMatch(binding);
		if (!resolved || resolved.channelId !== normalizedChannel || resolved.agentId !== normalizedAgentId) continue;
		if (!routeBindingScopeMatches(resolved, {
			groupSpace: params.groupSpace,
			memberRoleIds: params.memberRoleIds
		})) continue;
		if (!hasPeerContext) return resolved.accountId;
		if (resolved.peerId === "*") {
			if (!resolved.peerKind || !normalizedPeerKind || !peerKindMatches(resolved.peerKind, normalizedPeerKind)) continue;
			wildcardPeerMatch ??= resolved.accountId;
		} else if (resolved.peerId) {
			if (resolved.peerKind && normalizedPeerKind && !peerKindMatches(resolved.peerKind, normalizedPeerKind)) continue;
			if (exactPeerIds.has(resolved.peerId)) return resolved.accountId;
		} else channelOnlyFallback ??= resolved.accountId;
	}
	return wildcardPeerMatch ?? channelOnlyFallback;
}
//#endregion
export { resolveFirstBoundAccountId as t };
