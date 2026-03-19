import "../../logger-Bisu6sgz.js";
import "../../paths-D_QmduAc.js";
import "../../tmp-openclaw-dir-CEAo8CGE.js";
import "../../theme-Bnch_o1K.js";
import "../../globals-CnsLPQis.js";
import "../../subsystem-Dm-AQqmI.js";
import "../../ansi-BMqrB9En.js";
import "../../utils-CIAfMgvq.js";
import "../../agent-scope-BvOTVsJZ.js";
import "../../boundary-path-BVHzCDEE.js";
import "../../boundary-file-read-1knRHcS0.js";
import "../../logger-DcSg74GU.js";
import "../../exec-Bwz57vWc.js";
import "../../workspace-C3BQkKrq.js";
import "../../registry-DHFXbGRB.js";
import "../../zod-schema.core-2nNLrIvV.js";
import "../../resolve-route-BKJ_gx17.js";
import "../../config-schema-SbU9iMOP.js";
import { i as definePluginEntry } from "../../core-DoWJeX1b.js";
import "../../delegate-VRfyt_wr.js";
import "../../secret-file-C6VA1we_.js";
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
