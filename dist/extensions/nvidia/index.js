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
import { n as buildSingleProviderApiKeyCatalog } from "../../provider-catalog-D_413wKa.js";
import { i as definePluginEntry } from "../../core-DczSNd0Z.js";
import { t as buildNvidiaProvider } from "../../provider-catalog-CRQQXmY2.js";
import "../../delegate-CWt-W_4V.js";
import "../../secret-file-BhPVdZGQ.js";
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
