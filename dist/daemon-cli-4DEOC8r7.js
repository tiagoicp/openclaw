import { t as formatDocsLink } from "./links-CX_lepoz.js";
import { r as theme } from "./theme-D5sxSdHD.js";
import { t as addGatewayServiceCommands } from "./register-service-commands-Co5AEGDM.js";
import "./install-CJvvHw8B.js";
import "./lifecycle-BAN3305B.js";
import "./status-Dv2wF5Kn.js";
//#region src/cli/daemon-cli/register.ts
function registerDaemonCli(program) {
	addGatewayServiceCommands(program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`), { statusDescription: "Show service install status + probe the Gateway" });
}
//#endregion
export { registerDaemonCli as t };
