import { h as MarkdownConfigSchema, l as GroupPolicySchema, o as DmPolicySchema } from "./zod-schema.core-Du3k_7-j.js";
import { n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "./config-schema-rBqVo6-O.js";
import { c as ToolPolicySchema } from "./zod-schema.agent-runtime-DR2c4w8l.js";
import { c as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-Da4M1Ru3.js";
import { n as describeAccountSnapshot } from "./account-helpers-Cq1Zr5oH.js";
import "./core-w7kNLu40.js";
import { t as formatAllowFromLowercase } from "./allow-from-CULhQTVN.js";
import "./channel-config-schema-8omn2SVq.js";
import { n as createDangerousNameMatchingMutableAllowlistWarningCollector } from "./channel-policy-fpyKQCGQ.js";
import "./config-runtime-svP9ZomL.js";
import { t as zod_exports } from "./zod-BIW-RsMp.js";
import { a as resolveZalouserAccountSync, i as resolveDefaultZalouserAccountId, r as listZalouserAccountIds, t as checkZcaAuthenticated } from "./accounts-DGryXirI.js";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-B8rhCORy.js";
import { n as isZalouserMutableGroupEntry } from "./security-audit-o59Wn9YH.js";
//#region extensions/zalouser/src/config-schema.ts
const groupConfigSchema = zod_exports.z.object({
	enabled: zod_exports.z.boolean().optional(),
	requireMention: zod_exports.z.boolean().optional(),
	tools: ToolPolicySchema
});
const ZalouserConfigSchema = buildCatchallMultiAccountChannelSchema(zod_exports.z.object({
	name: zod_exports.z.string().optional(),
	enabled: zod_exports.z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	profile: zod_exports.z.string().optional(),
	dangerouslyAllowNameMatching: zod_exports.z.boolean().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	historyLimit: zod_exports.z.number().int().min(0).optional(),
	groupAllowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: zod_exports.z.object({}).catchall(groupConfigSchema).optional(),
	messagePrefix: zod_exports.z.string().optional(),
	responsePrefix: zod_exports.z.string().optional()
}));
//#endregion
//#region extensions/zalouser/src/doctor.ts
function asObjectRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
const zalouserDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "hybrid",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectMutableAllowlistWarnings: createDangerousNameMatchingMutableAllowlistWarningCollector({
		channel: "zalouser",
		detector: isZalouserMutableGroupEntry,
		collectLists: (scope) => {
			const groups = asObjectRecord(scope.account.groups);
			return groups ? [{
				pathLabel: `${scope.prefix}.groups`,
				list: Object.keys(groups)
			}] : [];
		}
	})
};
//#endregion
//#region extensions/zalouser/src/shared.ts
const zalouserMeta = {
	id: "zalouser",
	label: "Zalo Personal",
	selectionLabel: "Zalo (Personal Account)",
	docsPath: "/channels/zalouser",
	docsLabel: "zalouser",
	blurb: "Zalo personal account via QR code login.",
	aliases: ["zlu"],
	order: 85,
	quickstartAllowFrom: false
};
const zalouserConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "zalouser",
	listAccountIds: listZalouserAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveZalouserAccountSync),
	defaultAccountId: resolveDefaultZalouserAccountId,
	clearBaseFields: [
		"profile",
		"name",
		"dmPolicy",
		"allowFrom",
		"historyLimit",
		"groupAllowFrom",
		"groupPolicy",
		"groups",
		"messagePrefix"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(zalouser|zlu):/i
	})
});
function createZalouserPluginBase(params) {
	return {
		id: "zalouser",
		meta: zalouserMeta,
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: true,
			threads: false,
			polls: false,
			nativeCommands: false,
			blockStreaming: true
		},
		doctor: zalouserDoctor,
		reload: { configPrefixes: ["channels.zalouser"] },
		configSchema: buildChannelConfigSchema(ZalouserConfigSchema),
		config: {
			...zalouserConfigAdapter,
			isConfigured: async (account) => await checkZcaAuthenticated(account.profile),
			describeAccount: (account) => describeAccountSnapshot({ account })
		},
		setup: params.setup
	};
}
//#endregion
export { createZalouserPluginBase as t };
