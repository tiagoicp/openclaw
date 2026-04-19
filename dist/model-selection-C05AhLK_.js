import { i as normalizeLowercaseStringOrEmpty, o as normalizeOptionalLowercaseString } from "./string-coerce-BUSzWgUA.js";
import { r as normalizeProviderId } from "./provider-id-D6GoSUK5.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Cp6kIcbn.js";
import { n as resolveAgentModelPrimaryValue, r as toAgentModelListLike, t as resolveAgentModelFallbackValues } from "./model-input-rQYpOdVy.js";
import { _ as resolveAgentConfig, n as resolveAgentEffectiveModelPrimary, s as resolveAgentModelFallbacksOverride } from "./agent-scope-DsH_ZwEW.js";
import { p as resolveThinkingDefaultForModel } from "./thinking.shared-B_XYtu1m.js";
import { C as parseModelRef, a as buildAllowedModelSetWithFallbacks, b as legacyModelKey, c as buildModelAliasIndex, d as normalizeModelSelection, f as resolveAllowedModelRefFromAliasIndex, h as resolveConfiguredOpenRouterCompatAlias, l as getModelRefStatusWithFallbackModels, m as resolveConfiguredModelRef, p as resolveAllowlistModelKey$1, x as modelKey } from "./model-selection-cli-CXSa0KzE.js";
//#region src/agents/model-thinking-default.ts
function resolveThinkingDefault(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModel = normalizeLowercaseStringOrEmpty(params.model).replace(/\./g, "-");
	const catalogCandidate = Array.isArray(params.catalog) ? params.catalog.find((entry) => entry.provider === params.provider && entry.id === params.model) : void 0;
	const configuredModels = params.cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(params.provider, params.model);
	const legacyKey = legacyModelKey(params.provider, params.model);
	const normalizedCanonicalKey = normalizeLowercaseStringOrEmpty(canonicalKey);
	const normalizedLegacyKey = normalizeOptionalLowercaseString(legacyKey);
	const normalizedPrimarySelection = normalizeOptionalLowercaseString(normalizeModelSelection(params.cfg.agents?.defaults?.model));
	const explicitModelConfigured = (configuredModels ? canonicalKey in configuredModels : false) || Boolean(legacyKey && configuredModels && legacyKey in configuredModels) || normalizedPrimarySelection === normalizedCanonicalKey || Boolean(normalizedLegacyKey && normalizedPrimarySelection === normalizedLegacyKey) || normalizedPrimarySelection === normalizeLowercaseStringOrEmpty(params.model);
	const perModelThinking = configuredModels?.[canonicalKey]?.params?.thinking ?? (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
	if (perModelThinking === "off" || perModelThinking === "minimal" || perModelThinking === "low" || perModelThinking === "medium" || perModelThinking === "high" || perModelThinking === "xhigh" || perModelThinking === "adaptive") return perModelThinking;
	const configured = params.cfg.agents?.defaults?.thinkingDefault;
	if (configured) return configured;
	if (normalizedProvider === "anthropic" && (normalizedModel.startsWith("claude-opus-4-7") || normalizedModel.startsWith("claude-opus-4.7"))) return "off";
	if (normalizedProvider === "anthropic" && explicitModelConfigured && typeof catalogCandidate?.name === "string" && /4\.6\b/.test(catalogCandidate.name) && (normalizedModel.startsWith("claude-opus-4-6") || normalizedModel.startsWith("claude-sonnet-4-6"))) return "adaptive";
	return resolveThinkingDefaultForModel({
		provider: params.provider,
		model: params.model,
		catalog: params.catalog
	});
}
//#endregion
//#region src/agents/model-selection.ts
function resolvePersistedOverrideModelRef(params) {
	const defaultProvider = params.defaultProvider.trim();
	const overrideProvider = params.overrideProvider?.trim();
	const overrideModel = params.overrideModel?.trim();
	if (!overrideModel) return null;
	return parseModelRef(overrideProvider ? `${overrideProvider}/${overrideModel}` : overrideModel, defaultProvider) ?? {
		provider: overrideProvider || defaultProvider,
		model: overrideModel
	};
}
/**
* Runtime-first resolver for persisted model metadata.
* Use this when callers intentionally want the last executed model identity.
*/
function resolvePersistedModelRef(params) {
	const defaultProvider = params.defaultProvider.trim();
	const runtimeProvider = params.runtimeProvider?.trim();
	const runtimeModel = params.runtimeModel?.trim();
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		return parseModelRef(runtimeModel, defaultProvider) ?? {
			provider: defaultProvider,
			model: runtimeModel
		};
	}
	return resolvePersistedOverrideModelRef({
		defaultProvider,
		overrideProvider: params.overrideProvider,
		overrideModel: params.overrideModel
	});
}
/**
* Selected-model resolver for persisted model metadata.
* Use this for control/status/UI surfaces that should honor explicit session
* overrides before falling back to runtime identity.
*/
function resolvePersistedSelectedModelRef(params) {
	const override = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: params.overrideProvider,
		overrideModel: params.overrideModel
	});
	if (override) return override;
	return resolvePersistedModelRef({
		defaultProvider: params.defaultProvider,
		runtimeProvider: params.runtimeProvider,
		runtimeModel: params.runtimeModel
	});
}
function normalizeStoredOverrideModel(params) {
	const providerOverride = params.providerOverride?.trim();
	const modelOverride = params.modelOverride?.trim();
	if (!providerOverride || !modelOverride) return {
		providerOverride,
		modelOverride
	};
	const providerPrefix = `${providerOverride.toLowerCase()}/`;
	return {
		providerOverride,
		modelOverride: modelOverride.toLowerCase().startsWith(providerPrefix) ? modelOverride.slice(providerOverride.length + 1).trim() || modelOverride : modelOverride
	};
}
function resolveAllowlistModelKey(raw, defaultProvider, cfg) {
	return resolveAllowlistModelKey$1({
		cfg,
		raw,
		defaultProvider
	});
}
function resolveDefaultModelForAgent(params) {
	const agentModelOverride = params.agentId ? resolveAgentEffectiveModelPrimary(params.cfg, params.agentId) : void 0;
	return resolveConfiguredModelRef({
		cfg: agentModelOverride && agentModelOverride.length > 0 ? {
			...params.cfg,
			agents: {
				...params.cfg.agents,
				defaults: {
					...params.cfg.agents?.defaults,
					model: {
						...toAgentModelListLike(params.cfg.agents?.defaults?.model),
						primary: agentModelOverride
					}
				}
			}
		} : params.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
}
function resolveAllowedFallbacks(params) {
	if (params.agentId) {
		const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
		if (override !== void 0) return override;
	}
	return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}
function resolveSubagentConfiguredModelSelection(params) {
	const agentConfig = resolveAgentConfig(params.cfg, params.agentId);
	return normalizeModelSelection(agentConfig?.subagents?.model) ?? normalizeModelSelection(agentConfig?.model) ?? normalizeModelSelection(params.cfg.agents?.defaults?.subagents?.model);
}
function resolveSubagentSpawnModelSelection(params) {
	const runtimeDefault = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return normalizeModelSelection(params.modelOverride) ?? resolveSubagentConfiguredModelSelection({
		cfg: params.cfg,
		agentId: params.agentId
	}) ?? normalizeModelSelection(resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)) ?? `${runtimeDefault.provider}/${runtimeDefault.model}`;
}
function buildAllowedModelSet(params) {
	return buildAllowedModelSetWithFallbacks({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		fallbackModels: resolveAllowedFallbacks({
			cfg: params.cfg,
			agentId: params.agentId
		})
	});
}
function getModelRefStatus(params) {
	return getModelRefStatusWithFallbackModels({
		cfg: params.cfg,
		catalog: params.catalog,
		ref: params.ref,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		fallbackModels: resolveAllowedFallbacks({ cfg: params.cfg })
	});
}
function getModelRefStatusForResolve(params, ref) {
	return getModelRefStatus({
		cfg: params.cfg,
		catalog: params.catalog,
		ref,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
}
function resolveAllowedModelRef(params) {
	const trimmed = params.raw.trim();
	if (!trimmed) return { error: "invalid model: empty" };
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider
	});
	const openrouterCompatRef = resolveConfiguredOpenRouterCompatAlias({
		cfg: params.cfg,
		raw: trimmed,
		defaultProvider: params.defaultProvider
	});
	if (openrouterCompatRef) {
		const status = getModelRefStatusForResolve(params, openrouterCompatRef);
		if (!status.allowed) return { error: `model not allowed: ${status.key}` };
		return {
			ref: openrouterCompatRef,
			key: status.key
		};
	}
	return resolveAllowedModelRefFromAliasIndex({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex,
		getStatus: (ref) => getModelRefStatusForResolve(params, ref)
	});
}
/** Default reasoning level when session/directive do not set it: "on" if model supports reasoning, else "off". */
function resolveReasoningDefault(params) {
	const key = modelKey(params.provider, params.model);
	return (params.catalog?.find((entry) => entry.provider === params.provider && entry.id === params.model || entry.provider === key && entry.id === params.model))?.reasoning === true ? "on" : "off";
}
//#endregion
export { resolveAllowlistModelKey as a, resolvePersistedOverrideModelRef as c, resolveSubagentConfiguredModelSelection as d, resolveSubagentSpawnModelSelection as f, resolveAllowedModelRef as i, resolvePersistedSelectedModelRef as l, getModelRefStatus as n, resolveDefaultModelForAgent as o, resolveThinkingDefault as p, normalizeStoredOverrideModel as r, resolvePersistedModelRef as s, buildAllowedModelSet as t, resolveReasoningDefault as u };
