import { t as resolveBundledPluginsDir } from "./bundled-dir-CDxTi_-J.js";
import { n as normalizeBundledPluginArtifactSubpath } from "./public-surface-runtime-CwyWxkkT.js";
import { t as findBundledPluginMetadataById } from "./bundled-plugin-metadata-CU4kzys2.js";
import { l as resolveLoaderPackageRoot } from "./sdk-alias-pIecfmLZ.js";
import { t as buildPluginApi } from "./api-builder-DFZL_4QO.js";
import { i as loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader-DE-UixDZ.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/captured-registration.ts
function createCapturedPluginRegistration(params) {
	const providers = [];
	const agentHarnesses = [];
	const cliRegistrars = [];
	const cliBackends = [];
	const textTransforms = [];
	const speechProviders = [];
	const realtimeTranscriptionProviders = [];
	const realtimeVoiceProviders = [];
	const mediaUnderstandingProviders = [];
	const imageGenerationProviders = [];
	const videoGenerationProviders = [];
	const musicGenerationProviders = [];
	const webFetchProviders = [];
	const webSearchProviders = [];
	const memoryEmbeddingProviders = [];
	const tools = [];
	return {
		providers,
		agentHarnesses,
		cliRegistrars,
		cliBackends,
		textTransforms,
		speechProviders,
		realtimeTranscriptionProviders,
		realtimeVoiceProviders,
		mediaUnderstandingProviders,
		imageGenerationProviders,
		videoGenerationProviders,
		musicGenerationProviders,
		webFetchProviders,
		webSearchProviders,
		memoryEmbeddingProviders,
		tools,
		api: buildPluginApi({
			id: "captured-plugin-registration",
			name: "Captured Plugin Registration",
			source: "captured-plugin-registration",
			registrationMode: params?.registrationMode ?? "full",
			config: params?.config ?? {},
			runtime: {},
			logger: {
				info() {},
				warn() {},
				error() {},
				debug() {}
			},
			resolvePath: (input) => input,
			handlers: {
				registerCli(registrar, opts) {
					const descriptors = (opts?.descriptors ?? []).map((descriptor) => ({
						name: descriptor.name.trim(),
						description: descriptor.description.trim(),
						hasSubcommands: descriptor.hasSubcommands
					})).filter((descriptor) => descriptor.name && descriptor.description);
					const commands = [...opts?.commands ?? [], ...descriptors.map((descriptor) => descriptor.name)].map((command) => command.trim()).filter(Boolean);
					if (commands.length === 0) return;
					cliRegistrars.push({
						register: registrar,
						commands,
						descriptors
					});
				},
				registerProvider(provider) {
					providers.push(provider);
				},
				registerAgentHarness(harness) {
					agentHarnesses.push(harness);
				},
				registerCliBackend(backend) {
					cliBackends.push(backend);
				},
				registerTextTransforms(transforms) {
					textTransforms.push(transforms);
				},
				registerSpeechProvider(provider) {
					speechProviders.push(provider);
				},
				registerRealtimeTranscriptionProvider(provider) {
					realtimeTranscriptionProviders.push(provider);
				},
				registerRealtimeVoiceProvider(provider) {
					realtimeVoiceProviders.push(provider);
				},
				registerMediaUnderstandingProvider(provider) {
					mediaUnderstandingProviders.push(provider);
				},
				registerImageGenerationProvider(provider) {
					imageGenerationProviders.push(provider);
				},
				registerVideoGenerationProvider(provider) {
					videoGenerationProviders.push(provider);
				},
				registerMusicGenerationProvider(provider) {
					musicGenerationProviders.push(provider);
				},
				registerWebFetchProvider(provider) {
					webFetchProviders.push(provider);
				},
				registerWebSearchProvider(provider) {
					webSearchProviders.push(provider);
				},
				registerMemoryEmbeddingProvider(adapter) {
					memoryEmbeddingProviders.push(adapter);
				},
				registerTool(tool) {
					if (typeof tool !== "function") tools.push(tool);
				}
			}
		})
	};
}
function capturePluginRegistration(params) {
	const captured = createCapturedPluginRegistration();
	params.register(captured.api);
	return captured;
}
//#endregion
//#region src/test-utils/bundled-plugin-public-surface.ts
const OPENCLAW_PACKAGE_ROOT = resolveLoaderPackageRoot({
	modulePath: fileURLToPath(import.meta.url),
	moduleUrl: import.meta.url
}) ?? fileURLToPath(new URL("../..", import.meta.url));
function isSafeBundledPluginDirName(pluginId) {
	return /^[a-z0-9][a-z0-9._-]*$/u.test(pluginId);
}
function readPluginManifestId(pluginDir) {
	try {
		const manifestPath = path.join(pluginDir, "openclaw.plugin.json");
		const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		return typeof parsed.id === "string" ? parsed.id : void 0;
	} catch {
		return;
	}
}
function findBundledPluginMetadataFast(pluginId) {
	if (!isSafeBundledPluginDirName(pluginId)) return;
	const roots = [
		resolveBundledPluginsDir(),
		path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions"),
		path.resolve(OPENCLAW_PACKAGE_ROOT, "dist-runtime", "extensions"),
		path.resolve(OPENCLAW_PACKAGE_ROOT, "dist", "extensions")
	].filter((entry, index, values) => Boolean(entry) && values.indexOf(entry) === index);
	for (const root of roots) if (readPluginManifestId(path.join(root, pluginId)) === pluginId) return { dirName: pluginId };
}
function findBundledPluginMetadata(pluginId) {
	const metadata = findBundledPluginMetadataFast(pluginId) ?? findBundledPluginMetadataById(pluginId);
	if (!metadata) throw new Error(`Unknown bundled plugin id: ${pluginId}`);
	return metadata;
}
const loadBundledPluginPublicSurfaceSync = (params) => {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: findBundledPluginMetadata(params.pluginId).dirName,
		artifactBasename: normalizeBundledPluginArtifactSubpath(params.artifactBasename)
	});
};
const loadBundledPluginApiSync = (pluginId) => {
	return loadBundledPluginPublicSurfaceSync({
		pluginId,
		artifactBasename: "api.js"
	});
};
const loadBundledPluginTestApiSync = (pluginId) => {
	return loadBundledPluginPublicSurfaceSync({
		pluginId,
		artifactBasename: "test-api.js"
	});
};
function resolveBundledPluginPublicModulePath(params) {
	const metadata = findBundledPluginMetadata(params.pluginId);
	return path.resolve(OPENCLAW_PACKAGE_ROOT, "extensions", metadata.dirName, normalizeBundledPluginArtifactSubpath(params.artifactBasename));
}
function resolveVitestSourceModulePath(targetPath) {
	if (!targetPath.endsWith(".js")) return targetPath;
	const sourcePath = `${targetPath.slice(0, -3)}.ts`;
	return pathExists(sourcePath) ? sourcePath : targetPath;
}
function pathExists(filePath) {
	try {
		return Boolean(filePath) && path.isAbsolute(filePath) && fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function resolveRelativeBundledPluginPublicModuleId(params) {
	const fromFilePath = fileURLToPath(params.fromModuleUrl);
	const targetPath = resolveVitestSourceModulePath(resolveBundledPluginPublicModulePath({
		pluginId: params.pluginId,
		artifactBasename: params.artifactBasename
	}));
	const relativePath = path.relative(path.dirname(fromFilePath), targetPath).replaceAll(path.sep, "/");
	return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
}
//#endregion
export { capturePluginRegistration as a, resolveRelativeBundledPluginPublicModuleId as i, loadBundledPluginPublicSurfaceSync as n, createCapturedPluginRegistration as o, loadBundledPluginTestApiSync as r, loadBundledPluginApiSync as t };
