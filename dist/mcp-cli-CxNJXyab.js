import "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import "./theme-CWrxY1-_.js";
import "./globals-ir4cuPXg.js";
import { m as defaultRuntime } from "./subsystem-DZirmh0Z.js";
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
import "./io-CT8Gq6Au.js";
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
import { a as unsetConfiguredMcpServer, i as setConfiguredMcpServer, n as listConfiguredMcpServers, t as parseConfigValue } from "./config-value-Ca8Vblp4.js";
//#region src/cli/mcp-cli.ts
function fail(message) {
	defaultRuntime.error(message);
	defaultRuntime.exit(1);
	throw new Error(message);
}
function printJson(value) {
	defaultRuntime.log(JSON.stringify(value, null, 2));
}
function registerMcpCli(program) {
	const mcp = program.command("mcp").description("Manage OpenClaw MCP server config");
	mcp.command("list").description("List configured MCP servers").option("--json", "Print JSON").action(async (opts) => {
		const loaded = await listConfiguredMcpServers();
		if (!loaded.ok) fail(loaded.error);
		if (opts.json) {
			printJson(loaded.mcpServers);
			return;
		}
		const names = Object.keys(loaded.mcpServers).toSorted();
		if (names.length === 0) {
			defaultRuntime.log(`No MCP servers configured in ${loaded.path}.`);
			return;
		}
		defaultRuntime.log(`MCP servers (${loaded.path}):`);
		for (const name of names) defaultRuntime.log(`- ${name}`);
	});
	mcp.command("show").description("Show one configured MCP server or the full MCP config").argument("[name]", "MCP server name").option("--json", "Print JSON").action(async (name, opts) => {
		const loaded = await listConfiguredMcpServers();
		if (!loaded.ok) fail(loaded.error);
		const value = name ? loaded.mcpServers[name] : loaded.mcpServers;
		if (name && !value) fail(`No MCP server named "${name}" in ${loaded.path}.`);
		if (opts.json) {
			printJson(value ?? {});
			return;
		}
		if (name) defaultRuntime.log(`MCP server "${name}" (${loaded.path}):`);
		else defaultRuntime.log(`MCP servers (${loaded.path}):`);
		printJson(value ?? {});
	});
	mcp.command("set").description("Set one configured MCP server from a JSON object").argument("<name>", "MCP server name").argument("<value>", "JSON object, for example {\"command\":\"uvx\",\"args\":[\"context7-mcp\"]}").action(async (name, rawValue) => {
		const parsed = parseConfigValue(rawValue);
		if (parsed.error) fail(parsed.error);
		const result = await setConfiguredMcpServer({
			name,
			server: parsed.value
		});
		if (!result.ok) fail(result.error);
		defaultRuntime.log(`Saved MCP server "${name}" to ${result.path}.`);
	});
	mcp.command("unset").description("Remove one configured MCP server").argument("<name>", "MCP server name").action(async (name) => {
		const result = await unsetConfiguredMcpServer({ name });
		if (!result.ok) fail(result.error);
		if (!result.removed) fail(`No MCP server named "${name}" in ${result.path}.`);
		defaultRuntime.log(`Removed MCP server "${name}" from ${result.path}.`);
	});
}
//#endregion
export { registerMcpCli };
