import { t as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-D0UoDGiG.js";
import { r as resolveManifestContractPluginIds, t as loadPluginManifestRegistry } from "./manifest-registry-CIsaiiqr.js";
import { a as normalizePluginIdScope, n as createPluginIdScopeSet, o as serializePluginIdScope } from "./channel-configured-CpwzgKh9.js";
import { n as resolveBundledPluginCompatibleLoadValues } from "./activation-context-BP1n-KKj.js";
//#region src/plugins/web-provider-resolution-shared.ts
function comparePluginProvidersAlphabetically(left, right) {
	return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
function sortPluginProviders(providers) {
	return providers.toSorted(comparePluginProvidersAlphabetically);
}
function sortPluginProvidersForAutoDetect(providers) {
	return providers.toSorted((left, right) => {
		const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return comparePluginProvidersAlphabetically(left, right);
	});
}
function pluginManifestDeclaresProviderConfig(record, configKey, contract) {
	if ((record.contracts?.[contract]?.length ?? 0) > 0) return true;
	if (Object.keys(record.configUiHints ?? {}).some((key) => key === configKey || key.startsWith(`${configKey}.`))) return true;
	const properties = record.configSchema?.properties;
	return typeof properties === "object" && properties !== null && configKey in properties;
}
function resolveManifestDeclaredWebProviderCandidatePluginIds(params) {
	const scopedPluginIds = normalizePluginIdScope(params.onlyPluginIds);
	const onlyPluginIdSet = createPluginIdScopeSet(scopedPluginIds);
	const ids = loadPluginManifestRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}).plugins.filter((plugin) => (!params.origin || plugin.origin === params.origin) && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && pluginManifestDeclaresProviderConfig(plugin, params.configKey, params.contract)).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
	if (ids.length > 0) return ids;
	return scopedPluginIds?.length === 0 ? [] : void 0;
}
function resolveBundledWebProviderCompatPluginIds(params) {
	return resolveManifestContractPluginIds({
		contract: params.contract,
		origin: "bundled",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
}
function resolveBundledWebProviderResolutionConfig(params) {
	const activation = resolveBundledPluginCompatibleLoadValues({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		applyAutoEnable: true,
		compatMode: {
			allowlist: params.bundledAllowlistCompat,
			enablement: "always",
			vitest: true
		},
		resolveCompatPluginIds: (compatParams) => resolveBundledWebProviderCompatPluginIds({
			contract: params.contract,
			...compatParams
		})
	});
	return {
		config: activation.config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons
	};
}
function buildWebProviderSnapshotCacheKey(params) {
	const envKey = typeof params.envKey === "string" ? params.envKey : Object.entries(params.envKey).toSorted(([left], [right]) => left.localeCompare(right));
	const onlyPluginIds = normalizePluginIdScope(params.onlyPluginIds);
	return JSON.stringify({
		workspaceDir: params.workspaceDir ?? "",
		bundledAllowlistCompat: params.bundledAllowlistCompat === true,
		origin: params.origin ?? "",
		onlyPluginIds: serializePluginIdScope(onlyPluginIds),
		env: envKey
	});
}
function mapRegistryProviders(params) {
	const onlyPluginIdSet = createPluginIdScopeSet(normalizePluginIdScope(params.onlyPluginIds));
	return params.sortProviders(params.entries.filter((entry) => !onlyPluginIdSet || onlyPluginIdSet.has(entry.pluginId)).map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId })));
}
//#endregion
//#region src/plugins/web-fetch-providers.shared.ts
function sortWebFetchProviders(providers) {
	return sortPluginProviders(providers);
}
function sortWebFetchProvidersForAutoDetect(providers) {
	return sortPluginProvidersForAutoDetect(providers);
}
function resolveBundledWebFetchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webFetchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		bundledAllowlistCompat: params.bundledAllowlistCompat
	});
}
//#endregion
//#region src/plugins/web-provider-public-artifacts.explicit.ts
const WEB_SEARCH_ARTIFACT_CANDIDATES = [
	"web-search-contract-api.js",
	"web-search-provider.js",
	"web-search.js"
];
const WEB_FETCH_ARTIFACT_CANDIDATES = [
	"web-fetch-contract-api.js",
	"web-fetch-provider.js",
	"web-fetch.js"
];
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWebProviderPlugin(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.label === "string" && typeof value.hint === "string" && isStringArray(value.envVars) && typeof value.placeholder === "string" && typeof value.signupUrl === "string" && typeof value.credentialPath === "string" && typeof value.getCredentialValue === "function" && typeof value.setCredentialValue === "function" && typeof value.createTool === "function";
}
function isWebSearchProviderPlugin(value) {
	return isWebProviderPlugin(value);
}
function isWebFetchProviderPlugin(value) {
	return isWebProviderPlugin(value);
}
function collectProviderFactories(params) {
	const providers = [];
	for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith(params.suffix)) continue;
		const candidate = exported();
		if (params.isProvider(candidate)) providers.push(candidate);
	}
	return providers;
}
function tryLoadBundledPublicArtifactModule(params) {
	for (const artifactBasename of params.artifactCandidates) try {
		return loadBundledPluginPublicArtifactModuleSync({
			dirName: params.dirName,
			artifactBasename
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface ")) continue;
		throw error;
	}
	return null;
}
function normalizeExplicitBundledPluginIds(pluginIds) {
	return [...new Set(pluginIds)].toSorted((left, right) => left.localeCompare(right));
}
function loadBundledWebSearchProviderEntriesFromDir(params) {
	const mod = tryLoadBundledPublicArtifactModule({
		dirName: params.dirName,
		artifactCandidates: WEB_SEARCH_ARTIFACT_CANDIDATES
	});
	if (!mod) return null;
	const providers = collectProviderFactories({
		mod,
		suffix: "WebSearchProvider",
		isProvider: isWebSearchProviderPlugin
	});
	if (providers.length === 0) return null;
	return providers.map((provider) => Object.assign({}, provider, { pluginId: params.pluginId }));
}
function loadBundledWebFetchProviderEntriesFromDir(params) {
	const mod = tryLoadBundledPublicArtifactModule({
		dirName: params.dirName,
		artifactCandidates: WEB_FETCH_ARTIFACT_CANDIDATES
	});
	if (!mod) return null;
	const providers = collectProviderFactories({
		mod,
		suffix: "WebFetchProvider",
		isProvider: isWebFetchProviderPlugin
	});
	if (providers.length === 0) return null;
	return providers.map((provider) => Object.assign({}, provider, { pluginId: params.pluginId }));
}
function resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(params) {
	const providers = [];
	for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
		const loadedProviders = loadBundledWebSearchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
function resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(params) {
	const providers = [];
	for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
		const loadedProviders = loadBundledWebFetchProviderEntriesFromDir({
			dirName: pluginId,
			pluginId
		});
		if (!loadedProviders) return null;
		providers.push(...loadedProviders);
	}
	return providers;
}
//#endregion
//#region src/plugins/web-search-providers.shared.ts
function sortWebSearchProviders(providers) {
	return sortPluginProviders(providers);
}
function sortWebSearchProvidersForAutoDetect(providers) {
	return sortPluginProvidersForAutoDetect(providers);
}
function resolveBundledWebSearchResolutionConfig(params) {
	return resolveBundledWebProviderResolutionConfig({
		contract: "webSearchProviders",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		bundledAllowlistCompat: params.bundledAllowlistCompat
	});
}
//#endregion
export { loadBundledWebSearchProviderEntriesFromDir as a, resolveBundledWebFetchResolutionConfig as c, buildWebProviderSnapshotCacheKey as d, mapRegistryProviders as f, loadBundledWebFetchProviderEntriesFromDir as i, sortWebFetchProviders as l, sortWebSearchProviders as n, resolveBundledExplicitWebFetchProvidersFromPublicArtifacts as o, resolveManifestDeclaredWebProviderCandidatePluginIds as p, sortWebSearchProvidersForAutoDetect as r, resolveBundledExplicitWebSearchProvidersFromPublicArtifacts as s, resolveBundledWebSearchResolutionConfig as t, sortWebFetchProvidersForAutoDetect as u };
