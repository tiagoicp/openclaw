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
import { n as buildSingleProviderApiKeyCatalog } from "../../provider-catalog-C51_gEwd.js";
import { i as definePluginEntry } from "../../core-DoWJeX1b.js";
import { t as buildNvidiaProvider } from "../../provider-catalog-CeQr0_fw.js";
import "../../delegate-DsPW8Ams.js";
import "../../secret-file-C6VA1we_.js";
//#region extensions/nvidia/index.ts
const PROVIDER_ID = "nvidia";
var nvidia_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "NVIDIA Provider",
	description: "Bundled NVIDIA provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "NVIDIA",
			docsPath: "/providers/nvidia",
			envVars: ["NVIDIA_API_KEY"],
			auth: [],
			catalog: {
				order: "simple",
				run: (ctx) => buildSingleProviderApiKeyCatalog({
					ctx,
					providerId: PROVIDER_ID,
					buildProvider: buildNvidiaProvider
				})
			}
		});
	}
});
//#endregion
export { nvidia_default as default };
