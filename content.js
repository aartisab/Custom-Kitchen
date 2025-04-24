"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Content script loaded for AllRecipes extension!", window.location.href);
var scraper_1 = require("./scraper");
chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
    console.log("Message received in content script:", msg);
    if (msg.action === "GET_RECIPE") {
        var data = (0, scraper_1.extractAllRecipesRecipe)();
        console.log("Extracted data:", data);
        sendResponse({ data: data });
    }
    return true;
});
