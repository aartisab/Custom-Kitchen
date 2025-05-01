document.addEventListener('DOMContentLoaded', () => {
  const genPage = document.getElementById('generate-page');
  const histPage = document.getElementById('history-page');

  document.getElementById('to-history').addEventListener('click', () => {
    genPage.hidden = true;
    histPage.hidden = false;
    loadHistory();
  });

  document.getElementById('back').addEventListener('click', () => {
    histPage.hidden = true;
    genPage.hidden = false;
  });

  document.getElementById("generate").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id || !tab.url.includes("allrecipes.com")) {
      return showToast("❌ This is not an AllRecipes page.");
    }
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractAllRecipesRecipe
    });
    const recipe = results[0]?.result;
    if (!recipe) {
      return showToast("❌ Could not extract recipe.");
    }

    const mode = document.querySelector('input[name="mode"]:checked').value;
    const param = document.getElementById("param").value.trim();
    const language = document.getElementById("language-select").value;
    const translateLine = language !== 'English'
      ? `Translate the full recipe into ${language}:\n\n`
      : "";

    let prompt = translateLine;
    if (mode === "diet") {
      prompt += `Modify this recipe to be "${param}":\n\n` +
        `Title: ${recipe.title}\n` +
        `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
        `Instructions:\n- ${recipe.instructions.join("\n- ")}`;
    } else {
      prompt += `Fuse this recipe with "${param}" cuisine:\n\n` +
        `Title: ${recipe.title}\n` +
        `Ingredients:\n- ${recipe.ingredients.join("\n- ")}\n` +
        `Instructions:\n- ${recipe.instructions.join("\n- ")}`;
    }

    document.getElementById("output").value = prompt;
    showToast("✅ Prompt generated!");

    chrome.storage.local.get({ history: [] }, ({ history }) => {
      history.unshift({
        time: new Date().toLocaleString(),
        prompt
      });
      history = history.slice(0, 10);
      chrome.storage.local.set({ history });
    });
  });

  document.getElementById("copy").addEventListener("click", () => {
    const txt = document.getElementById("output").value;
    if (!txt) return showToast("⚠️ No prompt to copy.");
    navigator.clipboard.writeText(txt).then(() => showToast("✅ Prompt copied!"));
  });

  document.getElementById("clearHistory").addEventListener("click", () => {
    chrome.storage.local.set({ history: [] }, loadHistory);
  });

  function loadHistory() {
    chrome.storage.local.get({ history: [] }, ({ history }) => {
      const list = document.getElementById("historyList");
      list.innerHTML = '';
      if (!history.length) {
        return list.textContent = 'No history yet.';
      }
      history.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
          <strong>${item.time}</strong>
          <pre style="white-space:pre-wrap; background:#f1f1f1; padding:5px; border-radius:5px;">
${item.prompt}
          </pre>
          <button data-i="${i}" class="btn secondary copy-hist">Copy</button>
        `;
        list.appendChild(div);
      });
      list.querySelectorAll('.copy-hist').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.getAttribute('data-i');
          navigator.clipboard.writeText(history[idx].prompt);
        });
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById(genPage.hidden ? 'toast-history' : 'toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    setTimeout(() => toast.classList.replace('show', 'hidden'), 2000);
  }

  document.getElementById('toast').classList.add('hidden');
  document.getElementById('toast-history').classList.add('hidden');
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


