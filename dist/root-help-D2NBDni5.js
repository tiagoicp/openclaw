import "./logger-Bisu6sgz.js";
import "./paths-D_QmduAc.js";
import "./tmp-openclaw-dir-CEAo8CGE.js";
import "./theme-Bnch_o1K.js";
import "./globals-CnsLPQis.js";
import "./ansi-BMqrB9En.js";
import "./utils-CIAfMgvq.js";
import "./links-DtUd3CJi.js";
import { n as VERSION } from "./version-BXFMfrjE.js";
import { t as getCoreCliCommandDescriptors } from "./core-command-descriptors-DtkDk3o-.js";
import { n as getSubCliEntries } from "./subcli-descriptors-Bsa-HCCT.js";
import "./banner-BjePPSlm.js";
import { t as configureProgramHelp } from "./help-D8fz5tEL.js";
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
