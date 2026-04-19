import { r as createLegacyPrivateNetworkDoctorContract } from "./ssrf-policy-DpRGHY9E.js";
import "./ssrf-runtime-CFMDGr4_.js";
//#region extensions/mattermost/src/doctor-contract.ts
const contract = createLegacyPrivateNetworkDoctorContract({ channelKey: "mattermost" });
const legacyConfigRules = contract.legacyConfigRules;
const normalizeCompatibilityConfig = contract.normalizeCompatibilityConfig;
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
