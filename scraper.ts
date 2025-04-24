//file to include scraping logic

export interface RecipeData {
  title: string;
  ingredients: string[];
  instructions: string[];
}

export function extractAllRecipesRecipe(): RecipeData | null {
  try {
    const title = document.querySelector(".article-heading")?.textContent?.trim() || "Untitled Recipe";

    const ingredients = Array.from(
      document.querySelectorAll("ul.mm-recipes-structured-ingredients__list li")
    )
      .map(el => el.textContent?.trim())
      .filter((text): text is string => !!text);

    const instructions = Array.from(
      document.querySelectorAll("#mntl-sc-block_1-0 li")
    )
      .map(el => el.textContent?.trim())
      .filter((text): text is string => !!text && text.length > 5);

    if (ingredients.length === 0 || instructions.length === 0) {
      console.warn("No ingredients or instructions found on AllRecipes page.");
      return null;
    }

    console.log("Extracted Recipe:", { title, ingredients, instructions });

    return {
      title,
      ingredients,
      instructions,
    };
  } catch (err) {
    console.error("Error scraping AllRecipes recipe:", err);
    return null;
  }
}
