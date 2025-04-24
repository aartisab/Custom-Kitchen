"use strict";
//file to include scraping logic
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAllRecipesRecipe = extractAllRecipesRecipe;
function extractAllRecipesRecipe() {
    var _a, _b;
    try {
        var title = ((_b = (_a = document.querySelector(".article-heading")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "Untitled Recipe";
        var ingredients = Array.from(document.querySelectorAll("ul.mm-recipes-structured-ingredients__list li"))
            .map(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
            .filter(function (text) { return !!text; });
        var instructions = Array.from(document.querySelectorAll("#mntl-sc-block_1-0 li"))
            .map(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
            .filter(function (text) { return !!text && text.length > 5; });
        if (ingredients.length === 0 || instructions.length === 0) {
            console.warn("No ingredients or instructions found on AllRecipes page.");
            return null;
        }
        console.log("Extracted Recipe:", { title: title, ingredients: ingredients, instructions: instructions });
        return {
            title: title,
            ingredients: ingredients,
            instructions: instructions,
        };
    }
    catch (err) {
        console.error("Error scraping AllRecipes recipe:", err);
        return null;
    }
}
