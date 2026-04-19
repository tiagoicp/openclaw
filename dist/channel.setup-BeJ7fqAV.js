import { t as createZalouserPluginBase } from "./shared-BcIT2hpx.js";
import { n as zalouserSetupAdapter } from "./setup-core-CcHOImoi.js";
import { t as zalouserSetupWizard } from "./setup-surface-D1F5Mdla.js";
//#region extensions/zalouser/src/channel.setup.ts
const zalouserSetupPlugin = { ...createZalouserPluginBase({
	setupWizard: zalouserSetupWizard,
	setup: zalouserSetupAdapter
}) };
//#endregion
export { zalouserSetupPlugin as t };
