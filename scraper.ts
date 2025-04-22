//file to include scraping logic

export interface RecipeData {
  title: string;
  ingredients: string[];
  instructions: string;
}

/**
 * Scrapes a recipe from an AllRecipes page.
 * Returns RecipeData if found, or null.
 */
export function extractAllRecipesRecipe(): RecipeData | null {
  try {
    const title = document.querySelector("h1.headline.heading-content")?.textContent?.trim() || "Untitled Recipe";

    const ingredients = Array.from(document.querySelectorAll("span.ingredients-item-name"))
      .map(el => el.textContent?.trim())
      .filter((text): text is string => !!text);

    const instructions = Array.from(document.querySelectorAll("li.subcontainer.instructions-section-item div.section-body"))
      .map(el => el.textContent?.trim())
      .filter((text): text is string => !!text && text.length > 5)
      .join("\n\n");

    if (ingredients.length === 0 || instructions.length === 0) {
      console.warn("No ingredients or instructions found on AllRecipes page.");
      return null;
    }

    return {
      title,
      ingredients,
      instructions
    };
  } catch (err) {
    console.error("Error scraping AllRecipes recipe:", err);
    return null;
  }
}
