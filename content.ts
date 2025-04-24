import { extractAllRecipesRecipe, RecipeData } from "./scraper";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "GET_RECIPE") {
    const data: RecipeData | null = extractAllRecipesRecipe();
    sendResponse({ data });
  }
  // return true to indicate you’ll respond asynchronously (not strictly needed here)
  return true;
});
