document.getElementById("generate").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(
      tab.id,
      { action: "GET_RECIPE" },
      response => {
        const recipe = response?.data;
        if (!recipe) {
          document.getElementById("output").value = "❌ Couldn't scrape recipe.";
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
      }
    );
  });
  