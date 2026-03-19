import "./redact-BDinS1q9.js";
import "./errors-BxyFnvP3.js";
import "./logger-Bisu6sgz.js";
import "./paths-D_QmduAc.js";
import "./tmp-openclaw-dir-CEAo8CGE.js";
import "./theme-Bnch_o1K.js";
import "./globals-CnsLPQis.js";
import { t as createSubsystemLogger } from "./subsystem-Dm-AQqmI.js";
import "./ansi-BMqrB9En.js";
import "./boolean-BgLJTske.js";
import "./env-mHZMLTjc.js";
import "./utils-CIAfMgvq.js";
import "./model-selection-BvgYPMZN.js";
import "./agent-scope-BvOTVsJZ.js";
import "./boundary-path-BVHzCDEE.js";
import "./boundary-file-read-1knRHcS0.js";
import "./logger-DcSg74GU.js";
import "./exec-Bwz57vWc.js";
import "./workspace-C3BQkKrq.js";
import { s as loadConfig } from "./io-BLrYinYw.js";
import "./host-env-security-DRYydSLp.js";
import "./safe-text-Bls0e7eh.js";
import "./version-BXFMfrjE.js";
import "./env-substitution-CCbMWMw3.js";
import "./config-state-DxIr_ZFp.js";
import "./includes-Babm_gOl.js";
import "./zod-schema.providers-core-JSZEvSLs.js";
import "./registry-DHFXbGRB.js";
import "./manifest-registry-BN97WD1N.js";
import "./ip-COVlKUC6.js";
import "./zod-schema.channels-CLt0EoyM.js";
import "./zod-schema.core-2nNLrIvV.js";
import "./zod-schema.providers-whatsapp-HQNdy-Lo.js";
import "./config-BuXmKtbA.js";
import "./audit-fs-CKHUnnaF.js";
import "./resolve-OpLtNdHa.js";
import { n as resolveBrowserConfig } from "./config-DDXUFMD9.js";
import "./tailnet-CYknm7bK.js";
import "./net-BDAb36NC.js";
import "./credentials-Dlg2fw8S.js";
import { $ as ensureBrowserControlAuth, b as createBrowserRouteContext, et as resolveBrowserControlAuth, t as registerBrowserRoutes, v as createBrowserRuntimeState, y as stopBrowserRuntime } from "./routes-D_PnVmld.js";
import "./path-alias-guards-pxSwQROL.js";
import "./ports-DbHCZ217.js";
import "./ports-lsof--GPZ_QnB.js";
import "./proxy-env-TLeMux0w.js";
import "./fs-safe-DNTBHVlm.js";
import "./mime-BZfENK18.js";
import "./image-ops-DsrR0jfa.js";
import { n as installBrowserCommonMiddleware, t as installBrowserAuthMiddleware } from "./server-middleware-uG2Nzt3c.js";
import express from "express";
//#region src/browser/server.ts
let state = null;
const logServer = createSubsystemLogger("browser").child("server");
async function startBrowserControlServerFromConfig() {
	if (state) return state;
	const cfg = loadConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	if (!resolved.enabled) return null;
	let browserAuth = resolveBrowserControlAuth(cfg);
	let browserAuthBootstrapFailed = false;
	try {
		const ensured = await ensureBrowserControlAuth({ cfg });
		browserAuth = ensured.auth;
		if (ensured.generatedToken) logServer.info("No browser auth configured; generated gateway.auth.token automatically.");
	} catch (err) {
		logServer.warn(`failed to auto-configure browser auth: ${String(err)}`);
		browserAuthBootstrapFailed = true;
	}
	if (browserAuthBootstrapFailed && !browserAuth.token && !browserAuth.password) {
		logServer.error("browser control startup aborted: authentication bootstrap failed and no fallback auth is configured.");
		return null;
	}
	const app = express();
	installBrowserCommonMiddleware(app);
	installBrowserAuthMiddleware(app, browserAuth);
	registerBrowserRoutes(app, createBrowserRouteContext({
		getState: () => state,
		refreshConfigFromDisk: true
	}));
	const port = resolved.controlPort;
	const server = await new Promise((resolve, reject) => {
		const s = app.listen(port, "127.0.0.1", () => resolve(s));
		s.once("error", reject);
	}).catch((err) => {
		logServer.error(`openclaw browser server failed to bind 127.0.0.1:${port}: ${String(err)}`);
		return null;
	});
	if (!server) return null;
	state = await createBrowserRuntimeState({
		server,
		port,
		resolved,
		onWarn: (message) => logServer.warn(message)
	});
	const authMode = browserAuth.token ? "token" : browserAuth.password ? "password" : "off";
	logServer.info(`Browser control listening on http://127.0.0.1:${port}/ (auth=${authMode})`);
	return state;
}
async function stopBrowserControlServer() {
	await stopBrowserRuntime({
		current: state,
		getState: () => state,
		clearState: () => {
			state = null;
		},
		closeServer: true,
		onWarn: (message) => logServer.warn(message)
	});
}
//#endregion
export { startBrowserControlServerFromConfig, stopBrowserControlServer };
