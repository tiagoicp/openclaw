import type { PluginRuntime } from "../api.js";
declare const setNostrRuntime: (next: PluginRuntime) => void, getNostrRuntime: () => PluginRuntime;
export { getNostrRuntime, setNostrRuntime };
