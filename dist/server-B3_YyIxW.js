import "./redact-DJH_TKCK.js";
import "./errors-Cn8_L7ES.js";
import "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import "./theme-CWrxY1-_.js";
import "./globals-ir4cuPXg.js";
import { t as createSubsystemLogger } from "./subsystem-DZirmh0Z.js";
import "./ansi-cwY8Vrne.js";
import "./boolean-B6zcAynR.js";
import "./env-BhXregSC.js";
import "./utils-DHW4u72m.js";
import "./model-selection-CnnQfpX3.js";
import "./agent-scope-CjT_nq79.js";
import "./boundary-path-C6aAhZ_Z.js";
import "./boundary-file-read-C_4eDsgv.js";
import "./logger-Cpn1HYqp.js";
import "./exec-CmLTXzPB.js";
import "./workspace-v-lU9b6K.js";
import { s as loadConfig } from "./io-CT8Gq6Au.js";
import "./host-env-security-d-Ny36Hl.js";
import "./safe-text-C0AOXwdt.js";
import "./version-DI1aYFTb.js";
import "./env-substitution-BgU3yPjd.js";
import "./config-state-ZFfx7wSS.js";
import "./includes-YrNTZia-.js";
import "./zod-schema.providers-core-Lq3UWu4O.js";
import "./registry-B1w4aWmD.js";
import "./manifest-registry-DX175h3u.js";
import "./ip-BX5dj8yZ.js";
import "./zod-schema.channels-FynKKE-p.js";
import "./zod-schema.core-Ck0QyHFp.js";
import "./zod-schema.providers-whatsapp-Ju7Eajoi.js";
import "./config-CjBMG9v0.js";
import "./audit-fs-Dg-uUMPP.js";
import "./resolve-166A8Gzf.js";
import { n as resolveBrowserConfig } from "./config-BB7MEmFV.js";
import "./tailnet-CITHROcF.js";
import "./net-CF5pU6NS.js";
import "./credentials-CDmoe70o.js";
import { $ as ensureBrowserControlAuth, b as createBrowserRouteContext, et as resolveBrowserControlAuth, t as registerBrowserRoutes, v as createBrowserRuntimeState, y as stopBrowserRuntime } from "./routes-YZNukrO4.js";
import "./path-alias-guards-Dh6gXf-O.js";
import "./ports-cCFbb5dC.js";
import "./ports-lsof-qBGFcQvX.js";
import "./proxy-env-CSWtGpnm.js";
import "./fs-safe-D8ECVG53.js";
import "./mime-BwxJ13J4.js";
import "./image-ops-C_ky4hEz.js";
import { n as installBrowserCommonMiddleware, t as installBrowserAuthMiddleware } from "./server-middleware-BXVNzIt5.js";
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
