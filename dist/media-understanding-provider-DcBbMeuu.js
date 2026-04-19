import { n as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-C3xYL5wU.js";
import "./media-understanding-Drhkp2A8.js";
//#region extensions/openrouter/media-understanding-provider.ts
const openrouterMediaUnderstandingProvider = {
	id: "openrouter",
	capabilities: ["image"],
	defaultModels: { image: "auto" },
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { openrouterMediaUnderstandingProvider as t };
