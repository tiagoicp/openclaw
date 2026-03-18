import { runPluginCommandWithTimeout, type RuntimeEnv } from "../../runtime-api.js";
export declare function isMatrixSdkAvailable(): boolean;
export declare function ensureMatrixCryptoRuntime(params?: {
    log?: (message: string) => void;
    requireFn?: (id: string) => unknown;
    resolveFn?: (id: string) => string;
    runCommand?: typeof runPluginCommandWithTimeout;
    nodeExecutable?: string;
}): Promise<void>;
export declare function ensureMatrixSdkInstalled(params: {
    runtime: RuntimeEnv;
    confirm?: (message: string) => Promise<boolean>;
}): Promise<void>;
