import { a as resolveOpenProviderRuntimeGroupPolicy, i as resolveDefaultGroupPolicy, r as resolveAllowlistProviderRuntimeGroupPolicy } from "./runtime-group-policy-CWn1ayGo.js";
//#region src/channels/plugins/group-policy-warnings.ts
function buildOpenGroupPolicyWarning(params) {
	return `- ${params.surface}: groupPolicy="open" ${params.openBehavior}. ${params.remediation}.`;
}
function buildOpenGroupPolicyRestrictSendersWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} to restrict senders`
	});
}
function buildOpenGroupPolicyNoRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `with no ${params.routeAllowlistPath} allowlist; any ${params.routeScope} can add + ping${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" + ${params.groupAllowFromPath} or configure ${params.routeAllowlistPath}`
	});
}
function buildOpenGroupPolicyConfigureRouteAllowlistWarning(params) {
	const mentionSuffix = params.mentionGated === false ? "" : " (mention-gated)";
	return buildOpenGroupPolicyWarning({
		surface: params.surface,
		openBehavior: `allows ${params.openScope} to trigger${mentionSuffix}`,
		remediation: `Set ${params.groupPolicyPath}="allowlist" and configure ${params.routeAllowlistPath}`
	});
}
function collectOpenGroupPolicyRestrictSendersWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	return [buildOpenGroupPolicyRestrictSendersWarning(params)];
}
function collectAllowlistProviderRestrictSendersWarnings(params) {
	return collectAllowlistProviderGroupPolicyWarnings({
		cfg: params.cfg,
		providerConfigPresent: params.providerConfigPresent,
		configuredGroupPolicy: params.configuredGroupPolicy,
		collect: (groupPolicy) => collectOpenGroupPolicyRestrictSendersWarnings({
			groupPolicy,
			surface: params.surface,
			openScope: params.openScope,
			groupPolicyPath: params.groupPolicyPath,
			groupAllowFromPath: params.groupAllowFromPath,
			mentionGated: params.mentionGated
		})
	});
}
function collectAllowlistProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
function collectOpenProviderGroupPolicyWarnings(params) {
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.configuredGroupPolicy ?? void 0,
		defaultGroupPolicy
	});
	return params.collect(groupPolicy);
}
function collectOpenGroupPolicyRouteAllowlistWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyRestrictSendersWarning(params.restrictSenders)];
	return [buildOpenGroupPolicyNoRouteAllowlistWarning(params.noRouteAllowlist)];
}
function collectOpenGroupPolicyConfiguredRouteWarnings(params) {
	if (params.groupPolicy !== "open") return [];
	if (params.routeAllowlistConfigured) return [buildOpenGroupPolicyConfigureRouteAllowlistWarning(params.configureRouteAllowlist)];
	return [buildOpenGroupPolicyWarning(params.missingRouteAllowlist)];
}
//#endregion
export { collectAllowlistProviderRestrictSendersWarnings as a, collectOpenGroupPolicyRouteAllowlistWarnings as c, collectAllowlistProviderGroupPolicyWarnings as i, collectOpenProviderGroupPolicyWarnings as l, buildOpenGroupPolicyRestrictSendersWarning as n, collectOpenGroupPolicyConfiguredRouteWarnings as o, buildOpenGroupPolicyWarning as r, collectOpenGroupPolicyRestrictSendersWarnings as s, buildOpenGroupPolicyConfigureRouteAllowlistWarning as t };
