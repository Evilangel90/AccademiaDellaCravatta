if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const integrationID = process.env.chatIntegrationId;
const serviceInstanceID = process.env.chatServiceInstanceId;

window.watsonAssistantChatOptions = {
    integrationID, // The ID of this integration.
    region: "eu-de", // The region your integration is hosted in.
    serviceInstanceID, // The ID of your service instance.
    onLoad: function (instance) {
        instance.render();
    }
};
setTimeout(function () {
    const t = document.createElement('script');
    t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
    document.head.appendChild(t);
});
