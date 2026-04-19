import { t as GatewayClient } from "../client-BHmYeoNE.js";
import { n as withOperatorApprovalsGatewayClient, t as createOperatorApprovalsGatewayClient } from "../operator-approvals-client-Bj6psYxj.js";
//#region src/gateway/channel-status-patches.ts
function createConnectedChannelStatusPatch(at = Date.now()) {
	return {
		connected: true,
		lastConnectedAt: at,
		lastEventAt: at
	};
}
//#endregion
export { GatewayClient, createConnectedChannelStatusPatch, createOperatorApprovalsGatewayClient, withOperatorApprovalsGatewayClient };
