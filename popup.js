document.getElementById("generate").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      document.getElementById("output").value = "❌ No active tab found.";
      return;
    }
    
    // Add timeout to prevent hanging if content script doesn't respond
    const response = await new Promise((resolve) => {
      chrome.tabs.sendMessage(
        tab.id,
        { action: "GET_RECIPE" },
        (response) => {
          resolve(response);
          if (chrome.runtime.lastError) {
            console.error("Chrome runtime error:", chrome.runtime.lastError);
            resolve(null);
          }
        }
      );
      
      // Timeout after 2 seconds
      setTimeout(() => resolve(null), 2000);
    });
    
    console.log("Response received:", response);
    const recipe = response?.data;
    
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
               `Instructions:\n1. ${recipe.instructions.join("\n1. ")}`;
    } else {
      prompt = `Fuse this recipe with "${param}" cuisine:\n\n` +
               `Title: ${recipe.title}\n` +
               `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
               `Instructions:\n1. ${recipe.instructions.join("\n1. ")}`;
    }

    document.getElementById("output").value = prompt;
  } catch (err) {
    console.error("Error in popup script:", err);
    document.getElementById("output").value = `❌ Error: ${err.message}`;
  }
});