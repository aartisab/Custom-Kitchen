console.log("Content script loaded for AllRecipes extension!", window.location.href);

import { extractAllRecipesRecipe, RecipeData } from "./scraper";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  console.log("Message received in content script:", msg);
  if (msg.action === "GET_RECIPE") {
    const data: RecipeData | null = extractAllRecipesRecipe();
    console.log("Extracted data:", data);
    sendResponse({ data });
  }
  return true;  
});