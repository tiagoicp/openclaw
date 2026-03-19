import "./logger-Qep7Kkk8.js";
import "./paths-C--RM-nt.js";
import "./tmp-openclaw-dir-DHiu0fYi.js";
import "./theme-CWrxY1-_.js";
import "./globals-ir4cuPXg.js";
import "./ansi-cwY8Vrne.js";
import "./utils-DHW4u72m.js";
import "./links-BdisHQRU.js";
import { n as VERSION } from "./version-DI1aYFTb.js";
import { t as getCoreCliCommandDescriptors } from "./core-command-descriptors-CwaeKsbr.js";
import { n as getSubCliEntries } from "./subcli-descriptors-D8P4OZd6.js";
import "./banner-DJGpHyPy.js";
import { t as configureProgramHelp } from "./help-CYqUnMUc.js";
import { Command } from "commander";
//#region src/cli/program/root-help.ts
function buildRootHelpProgram() {
	const program = new Command();
	configureProgramHelp(program, {
		programVersion: VERSION,
		channelOptions: [],
		messageChannelOptions: "",
		agentChannelOptions: ""
	});
	for (const command of getCoreCliCommandDescriptors()) program.command(command.name).description(command.description);
	for (const command of getSubCliEntries()) program.command(command.name).description(command.description);
	return program;
}
function outputRootHelp() {
	buildRootHelpProgram().outputHelp();
}
//#endregion
export { outputRootHelp };
