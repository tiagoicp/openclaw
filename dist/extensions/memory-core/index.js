import "../../logger-Qep7Kkk8.js";
import "../../paths-C--RM-nt.js";
import "../../tmp-openclaw-dir-DHiu0fYi.js";
import "../../theme-CWrxY1-_.js";
import "../../globals-ir4cuPXg.js";
import "../../subsystem-DZirmh0Z.js";
import "../../ansi-cwY8Vrne.js";
import "../../utils-DHW4u72m.js";
import "../../agent-scope-CjT_nq79.js";
import "../../boundary-path-C6aAhZ_Z.js";
import "../../boundary-file-read-C_4eDsgv.js";
import "../../logger-Cpn1HYqp.js";
import "../../exec-CmLTXzPB.js";
import "../../workspace-v-lU9b6K.js";
import "../../registry-B1w4aWmD.js";
import "../../zod-schema.core-Ck0QyHFp.js";
import "../../resolve-route-C0w3Gg7m.js";
import "../../config-schema-DxpGRv8-.js";
import { i as definePluginEntry } from "../../core-DczSNd0Z.js";
import "../../delegate-CWt-W_4V.js";
import "../../secret-file-BhPVdZGQ.js";
//#region extensions/memory-core/index.ts
var memory_core_default = definePluginEntry({
	id: "memory-core",
	name: "Memory (Core)",
	description: "File-backed memory search tools and CLI",
	kind: "memory",
	register(api) {
		api.registerTool((ctx) => {
			const memorySearchTool = api.runtime.tools.createMemorySearchTool({
				config: ctx.config,
				agentSessionKey: ctx.sessionKey
			});
			const memoryGetTool = api.runtime.tools.createMemoryGetTool({
				config: ctx.config,
				agentSessionKey: ctx.sessionKey
			});
			if (!memorySearchTool || !memoryGetTool) return null;
			return [memorySearchTool, memoryGetTool];
		}, { names: ["memory_search", "memory_get"] });
		api.registerCli(({ program }) => {
			api.runtime.tools.registerMemoryCli(program);
		}, { commands: ["memory"] });
	}
});
//#endregion
export { memory_core_default as default };
