document.addEventListener('DOMContentLoaded', function () {
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
        func: () => {
          try {
            const title = (document.querySelector(".article-heading")?.textContent || "Untitled Recipe").trim();
            const ingredients = Array.from(document.querySelectorAll("ul.mm-recipes-structured-ingredients__list li"))
              .map(el => el.textContent?.trim())
              .filter(Boolean);
            
            const instructionsList = document.querySelector("#mntl-sc-block_1-0");
            let instructions = [];
      
            if (instructionsList) {
              const listItems = instructionsList.querySelectorAll("li");
              instructions = Array.from(listItems)
                .map(li => {
                  const paragraphs = li.querySelectorAll("p[id^='mntl-sc-block_']");
                  if (paragraphs.length > 0) {
                    return Array.from(paragraphs).map(p => p.textContent.trim()).join(" ");
                  } else {
                    return li.textContent.trim();
                  }
                })
                .filter(text => !!text && text.length > 5);
            }
      
            if (ingredients.length === 0 || instructions.length === 0) return null;
      
            return { title, ingredients, instructions };
          } catch (err) {
            return null;
          }
        }
      });
      

      const recipe = results[0]?.result;

      if (!recipe) {
        document.getElementById("output").value =
          "❌ Couldn't scrape recipe. Make sure you're on an AllRecipes recipe page.";
        return;
      }

      const mode = document.querySelector('input[name="mode"]:checked').value;
      const param = document.getElementById("param").value.trim();
      const language = document.getElementById("language-select").value;
      let prompt = "";

      const translateLine = language !== 'English'
        ? `Translate the full recipe into ${language}:\n\n`
        : "";

      if (mode === "diet") {
        prompt = translateLine + `Modify this recipe to be "${param}":\n\n` +
          `Title: ${recipe.title}\n` +
          `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
          `Instructions:\n1. ${recipe.instructions.join("\n- ")}`;
      } else {
        prompt = translateLine + `Fuse this recipe with "${param}" cuisine:\n\n` +
          `Title: ${recipe.title}\n` +
          `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
          `Instructions:\n1. ${recipe.instructions.join("\n- ")}`;
      }

      document.getElementById("output").value = prompt;



      // Save prompt to history
      const newEntry = {
        timestamp: new Date().toLocaleString(),
        customization: param,
        mode,
        language,
        prompt
      };
      
      chrome.storage.local.get({ history: [] }, (data) => {
        const updatedHistory = [newEntry, ...data.history].slice(0, 10);
        chrome.storage.local.set({ history: updatedHistory }, () => {
          renderPromptHistory(updatedHistory);
        });
      });
      
      
    } catch (err) {
      console.error("Error in popup script:", err);
      document.getElementById("output").value = `❌ Error: ${err.message}`;
    }
  });

  document.getElementById("copy").addEventListener("click", () => {
    const output = document.getElementById("output");
    if (output.value.trim() !== "") {
      navigator.clipboard.writeText(output.value)
        .then(() => {
          showToast("✅ Prompt copied to clipboard!");
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
          showToast("❌ Failed to copy.");
        });
    } else {
      showToast("⚠️ Nothing to copy yet!");
    }
  });

  // Toast helper function
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");

    // Hide after 2 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }, 2000);
  }

  function renderPromptHistory(history) {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;
  
    historyList.innerHTML = "";
  
    if (!history || history.length === 0) {
      historyList.innerHTML = "<p>No history yet.</p>";
      return;
    }
  
    history.forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.style.marginBottom = "10px";
  
      item.innerHTML = `
        <strong>${entry.timestamp} — ${entry.mode === "diet" ? "Diet: " : "Fusion: "}${entry.customization}</strong><br>
        <pre style="white-space: pre-wrap; background: #f1f1f1; padding: 5px; border-radius: 5px;">${entry.prompt}</pre>
        <button data-index="${index}" class="copy-history btn secondary">Copy</button>
      `;
  
      historyList.appendChild(item);
    });
  
    document.querySelectorAll(".copy-history").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-index");
        const promptText = history[idx].prompt;
        navigator.clipboard.writeText(promptText).then(() => {
          alert("Copied from history!");
        });
      });
    });
  }
  

  // Call the function now that the DOM is ready
  chrome.storage.local.get({ history: [] }, (data) => {
    renderPromptHistory(data.history);
  });


  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    chrome.storage.local.set({ history: [] }, () => {
      renderPromptHistory([]);
    });
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
        .map(function (li) {
          // Look for <p>s with IDs matching the pattern for the instruction text only
          var paragraphs = Array.from(li.querySelectorAll("p[id^='mntl-sc-block_']"));

          if (paragraphs.length > 0) {
            return paragraphs
              .map(function (p) { return p.textContent.trim(); })
              .join(" ");
          } else {
            return li.textContent.trim();
          }
        })
        .filter(function (text) { return !!text && text.length > 5; });
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


