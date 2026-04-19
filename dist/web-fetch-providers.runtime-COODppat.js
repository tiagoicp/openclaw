import { c as resolveBundledWebFetchResolutionConfig, f as mapRegistryProviders, l as sortWebFetchProviders, p as resolveManifestDeclaredWebProviderCandidatePluginIds } from "./web-search-providers.shared-CE3BrnfH.js";
import { t as resolveBundledWebFetchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts-Q52ajWax.js";
import { i as resolvePluginWebProviders, r as createWebProviderSnapshotCache } from "./web-search-providers.runtime-BAuEkMx8.js";
//#region src/plugins/web-fetch-providers.runtime.ts
let webFetchProviderSnapshotCache = createWebProviderSnapshotCache();
function resolveWebFetchCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidatePluginIds({
		contract: "webFetchProviders",
		configKey: "webFetch",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		origin: params.origin
	});
}
function mapRegistryWebFetchProviders(params) {
	return mapRegistryProviders({
		entries: params.registry.webFetchProviders,
		onlyPluginIds: params.onlyPluginIds,
		sortProviders: sortWebFetchProviders
	});
}
function resolvePluginWebFetchProviders(params) {
	return resolvePluginWebProviders(params, {
		snapshotCache: webFetchProviderSnapshotCache,
		resolveBundledResolutionConfig: resolveBundledWebFetchResolutionConfig,
		resolveCandidatePluginIds: resolveWebFetchCandidatePluginIds,
		mapRegistryProviders: mapRegistryWebFetchProviders,
		resolveBundledPublicArtifactProviders: resolveBundledWebFetchProvidersFromPublicArtifacts
	});
}
//#endregion
export { resolvePluginWebFetchProviders as t };
