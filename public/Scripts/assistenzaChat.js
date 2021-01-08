
window.watsonAssistantChatOptions = {
    integrationID: "59b41d2f-307a-4d03-aa82-6014b7cb1bd1", // The ID of this integration.
    region: "eu-de", // The region your integration is hosted in.
    serviceInstanceID: "805fc6a9-497c-479e-8605-e7feba67d443", // The ID of your service instance.
    onLoad: function (instance) {
        instance.render();
    }
};
setTimeout(function () {
    const t = document.createElement('script');
    t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
    document.head.appendChild(t);
});
