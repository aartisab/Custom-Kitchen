document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("generate").addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        document.getElementById("output").value = "❌ No active tab found.";
        return;
      }

      if (!tab.url.includes("allrecipes.com")) {
        document.getElementById("output").value = "❌ This is not an AllRecipes page.";
        return;
      }
      console.log("Active tab found:", tab);
      // Add timeout to prevent hanging if content script doesn't respond
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractAllRecipesRecipe
      });

      const recipe = results[0]?.result;
      
      if (!recipe) {
        document.getElementById("output").value = 
          "❌ Couldn't scrape recipe. Make sure you're on an AllRecipes recipe page.";
        return;
      }

      const mode = document.querySelector('input[name="mode"]:checked').value;
      const param = document.getElementById("param").value.trim();
      let prompt = "";

      if (mode === "diet") {
        prompt = `Modify this recipe to be "${param}":\n\n` +
                `Title: ${recipe.title}\n` +
                `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
                `Instructions:\n1. ${recipe.instructions.join("\n- ")}`;
      } else {
        prompt = `Fuse this recipe with "${param}" cuisine:\n\n` +
                `Title: ${recipe.title}\n` +
                `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
                `Instructions:\n1. ${recipe.instructions.join("\n- ")}`;
      }

      document.getElementById("output").value = prompt;
    } catch (err) {
      console.error("Error in popup script:", err);
      document.getElementById("output").value = `❌ Error: ${err.message}`;
    }
  });
});

function extractAllRecipesRecipe() {
  var _a, _b;
  try {
      var title = ((_b = (_a = document.querySelector(".article-heading")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "Untitled Recipe";
      var ingredients = Array.from(document.querySelectorAll("ul.mm-recipes-structured-ingredients__list li"))
          .map(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
          .filter(function (text) { return !!text; });
      var instructionsList = document.querySelector("#mntl-sc-block_1-0");
      var instructions = [];
        
      if (instructionsList) {
          var listItems = instructionsList.querySelectorAll("li");
          
          instructions = Array.from(listItems)
              .map(function(li) {
                  // Look for <p>s with IDs matching the pattern for the instruction text only
                  var paragraphs = Array.from(li.querySelectorAll("p[id^='mntl-sc-block_']"));
                  
                  if (paragraphs.length > 0) {
                      return paragraphs
                          .map(function(p) { return p.textContent.trim(); })
                          .join(" ");
                  } else {
                      return li.textContent.trim();
                  }
              })
              .filter(function(text) { return !!text && text.length > 5; });
      }
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