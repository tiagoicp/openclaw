import { l as saveMediaBuffer } from "./store-B7mMYTxO.js";
import { t as loadWebMedia } from "./web-media-DTmirSsf.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-D9_F5CFQ.js";
//#region src/media/outbound-attachment.ts
async function resolveOutboundAttachmentFromUrl(mediaUrl, maxBytes, options) {
	const media = await loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
		maxBytes,
		mediaAccess: options?.mediaAccess,
		mediaLocalRoots: options?.localRoots,
		mediaReadFile: options?.readFile
	}));
	const saved = await saveMediaBuffer(media.buffer, media.contentType ?? void 0, "outbound", maxBytes);
	return {
		path: saved.path,
		contentType: saved.contentType
	};
}
//#endregion
export { resolveOutboundAttachmentFromUrl as t };
