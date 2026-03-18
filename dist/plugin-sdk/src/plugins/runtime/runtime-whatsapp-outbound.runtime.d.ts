import { sendMessageWhatsApp as sendMessageWhatsAppImpl, sendPollWhatsApp as sendPollWhatsAppImpl } from "../../../extensions/whatsapp/runtime-api.js";
export declare const runtimeWhatsAppOutbound: {
    sendMessageWhatsApp: typeof sendMessageWhatsAppImpl;
    sendPollWhatsApp: typeof sendPollWhatsAppImpl;
};
