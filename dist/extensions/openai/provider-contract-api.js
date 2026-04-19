//#region extensions/openai/provider-contract-api.ts
const noopAuth = async () => ({ profiles: [] });
function createOpenAICodexProvider() {
	return {
		id: "openai-codex",
		label: "OpenAI Codex",
		docsPath: "/providers/models",
		auth: [{
			id: "oauth",
			kind: "oauth",
			label: "ChatGPT OAuth",
			hint: "Browser sign-in",
			run: noopAuth
		}],
		wizard: { setup: {
			choiceId: "openai-codex",
			choiceLabel: "OpenAI Codex (ChatGPT OAuth)",
			choiceHint: "Browser sign-in",
			methodId: "oauth"
		} }
	};
}
function createOpenAIProvider() {
	return {
		id: "openai",
		label: "OpenAI",
		hookAliases: ["azure-openai", "azure-openai-responses"],
		docsPath: "/providers/models",
		envVars: ["OPENAI_API_KEY"],
		auth: [{
			id: "api-key",
			kind: "api_key",
			label: "OpenAI API key",
			hint: "Direct OpenAI API key",
			run: noopAuth,
			wizard: {
				choiceId: "openai-api-key",
				choiceLabel: "OpenAI API key",
				groupId: "openai",
				groupLabel: "OpenAI",
				groupHint: "Codex OAuth + API key"
			}
		}]
	};
}
//#endregion
export { createOpenAICodexProvider, createOpenAIProvider };
