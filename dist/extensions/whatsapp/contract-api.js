import { o as normalizeWhatsAppTarget$1, t as isWhatsAppGroupJid$1 } from "./normalize-target-786yB1mC.js";
import { t as whatsappCommandPolicy$1 } from "./command-policy-Rssq7XOx.js";
import { t as resolveLegacyGroupSessionKey$1 } from "./group-session-contract-CNmtB2Gb.js";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-B57At_ET.js";
import { r as isLegacyGroupSessionKey$1, t as canonicalizeLegacySessionKey$1 } from "./session-contract-Cf2phP7J.js";
import { n as listWhatsAppDirectoryGroupsFromConfig, r as listWhatsAppDirectoryPeersFromConfig } from "./directory-config-DUeRlZaR.js";
import { t as resolveWhatsAppRuntimeGroupPolicy$1 } from "./runtime-group-policy-DRdZfdOS.js";
import { t as __testing } from "./access-control-BJ8OBRXP.js";
//#region extensions/whatsapp/contract-api.ts
const canonicalizeLegacySessionKey = canonicalizeLegacySessionKey$1;
const isLegacyGroupSessionKey = isLegacyGroupSessionKey$1;
const isWhatsAppGroupJid = isWhatsAppGroupJid$1;
const normalizeWhatsAppTarget = normalizeWhatsAppTarget$1;
const resolveLegacyGroupSessionKey = resolveLegacyGroupSessionKey$1;
const resolveWhatsAppRuntimeGroupPolicy = resolveWhatsAppRuntimeGroupPolicy$1;
const whatsappAccessControlTesting = __testing;
const whatsappCommandPolicy = whatsappCommandPolicy$1;
//#endregion
export { canonicalizeLegacySessionKey, collectUnsupportedSecretRefConfigCandidates, isLegacyGroupSessionKey, isWhatsAppGroupJid, listWhatsAppDirectoryGroupsFromConfig, listWhatsAppDirectoryPeersFromConfig, normalizeWhatsAppTarget, resolveLegacyGroupSessionKey, resolveWhatsAppRuntimeGroupPolicy, unsupportedSecretRefSurfacePatterns, whatsappAccessControlTesting, whatsappCommandPolicy };
