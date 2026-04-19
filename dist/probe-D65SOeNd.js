import { i as formatErrorMessage } from "./errors-D8p6rxH8.js";
import "./text-runtime-DHfI0VWF.js";
import { t as withTimeout } from "./with-timeout-Eot6aUFA.js";
import "./error-runtime-D3bX8zTc.js";
import { t as MessagingApiClient } from "./messagingApiClient-C0Edtsjx.js";
//#region extensions/line/src/probe.ts
async function probeLineBot(channelAccessToken, timeoutMs = 5e3) {
	if (!channelAccessToken?.trim()) return {
		ok: false,
		error: "Channel access token not configured"
	};
	const client = new MessagingApiClient({ channelAccessToken: channelAccessToken.trim() });
	try {
		const profile = await withTimeout(client.getBotInfo(), timeoutMs);
		return {
			ok: true,
			bot: {
				displayName: profile.displayName,
				userId: profile.userId,
				basicId: profile.basicId,
				pictureUrl: profile.pictureUrl
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
//#endregion
export { probeLineBot as t };
