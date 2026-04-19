import { p as resolveDefaultWhatsAppAccountId } from "./text-runtime-LrXld8Dp.js";
import { t as getRegisteredWhatsAppConnectionController } from "./connection-controller-registry-kxS24Rzm.js";
import { loadConfig } from "openclaw/plugin-sdk/config-runtime";
//#region extensions/whatsapp/src/active-listener.ts
function resolveWebAccountId(accountId) {
	return (accountId ?? "").trim() || resolveDefaultWhatsAppAccountId(loadConfig());
}
function getActiveWebListener(accountId) {
	return getRegisteredWhatsAppConnectionController(resolveWebAccountId(accountId))?.getActiveListener() ?? null;
}
//#endregion
export { resolveWebAccountId as n, getActiveWebListener as t };
