type BundledPluginPublicSurfaceLoader = <T extends object>(params: {
    pluginId: string;
    artifactBasename: string;
}) => T;
type BundledPluginPublicArtifactLoader = <T extends object>(pluginId: string) => T;
export declare const loadBundledPluginPublicSurfaceSync: BundledPluginPublicSurfaceLoader;
export declare const loadBundledPluginApiSync: BundledPluginPublicArtifactLoader;
export declare const loadBundledPluginContractApiSync: BundledPluginPublicArtifactLoader;
export declare const loadBundledPluginRuntimeApiSync: BundledPluginPublicArtifactLoader;
export declare const loadBundledPluginTestApiSync: BundledPluginPublicArtifactLoader;
export declare function resolveBundledPluginPublicModulePath(params: {
    pluginId: string;
    artifactBasename: string;
}): string;
export declare function resolveRelativeBundledPluginPublicModuleId(params: {
    fromModuleUrl: string;
    pluginId: string;
    artifactBasename: string;
}): string;
export declare function resolveRelativeExtensionPublicModuleId(params: {
    fromModuleUrl: string;
    dirName: string;
    artifactBasename: string;
}): string;
export declare function resolveRelativeWorkspacePackagePublicModuleId(params: {
    fromModuleUrl: string;
    packageName: string;
    artifactBasename: string;
}): string;
export declare function resolveWorkspacePackagePublicModuleUrl(params: {
    packageName: string;
    artifactBasename: string;
}): string;
export {};
