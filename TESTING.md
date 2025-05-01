# Testing Custom Kitchen:

## Interface Testing:
- Clicking "Generate" when on a valid allrecipes.com/recipe/* page.
- Clicking "Generate" when not on a valid page (error handling).
- Switching between "Diet" and "Fusion" modes and seeing different prompt generation behavior.
- Inputting custom params (e.g., "vegan", "Korean") and verifying they appear in the output prompt.
- Changing language and ensuring an added on for translation at the top of the prompt.
- Clicking "Copy to Clipboard" after generating a prompt and verifying that it does get copied to clipboard.
- After generating prompt, check to see that it is added to the history
- Click "Clear history" and make sure it does so
- Click "About" button and make sure it jumps to the Github
- Error handling when no recipe is scraped (shows error message).
- Ensured Chrome runtime errors are caught and displayed in console without crashing the popup.
  
## Testing Prompts:

# Test Case 1: 
- Recipe: https://www.allrecipes.com/recipe/268091/easy-korean-ground-beef-bowl/
- Dietary Restriction: Vegan
- Language: Chinese
  
Correct and Actual:
Translate the full recipe into Chinese:

Modify this recipe to be "Vegan":

Title: Easy Korean Beef Bowl
Ingredients:
- 1 pound lean ground beef
- 5 cloves garlic, crushed
- 1 tablespoon freshly grated ginger
- 2 teaspoons toasted sesame oil
- ½ cup reduced-sodium soy sauce
- ⅓ cup light brown sugar
- ¼ teaspoon crushed red pepper
- 6  green onions, chopped, divided
- 4 cups hot cooked brown rice
- 1 tablespoon toasted sesame seeds
Instructions:
- Gather all ingredients.
- Heat a large skillet over medium-high heat. Add beef and cook, stirring and crumbling into small pieces until browned, 5 to 7 minutes. Drain excess grease.
- Stir in garlic, ginger, and sesame oil and cook until fragrant, about 2 minutes.
- Stir in soy sauce, brown sugar, and red pepper. Cook until beef absorbs some sauce, about 7 minutes.
- Add 1/2 of chopped green onions.
- Serve over hot cooked rice; garnish with sesame seeds and remaining green onions.

# Test Case 2: 
- Recipe: https://www.allrecipes.com/cheesy-lasagna-sheet-pasta-recipe-11703403
- Cuisine: Korean
- Language: English
  
Correct and Actual Output:
Fuse this recipe with "Korean" cuisine:

Title: Cheesy Lasagna Sheet Pasta
Ingredients:
- 8 ounces lasagna noodles, broken in half
- 1 (24-ounce) jar tomato sauce
- 8 ounces shredded whole milk mozzarella cheese
Instructions:
- Bring a large pot of lightly salted water to a boil. Cook lasanga noodles in the boiling water, stirring occasionally, until tender yet firm to the bite, 10 to 12 minutes.
- Strain noodles and return to the pot. Add tomato sauce and cook on medium heat until sauce is heated through, about 5 minutes.
- Add cheese and stir until cheese is melted. Serve immediately.

# Test Case 3: 
- Recipe: https://www.allrecipes.com/recipe/275430/air-fried-sesame-crusted-cod-with-snap-peas/
- Cuisine: Japanese
- Language: Japanese
  
Correct and Actual Output:
Translate the full recipe into Japanese:

Fuse this recipe with "Japanese" cuisine:

Title: Air-Fried Sesame-Crusted Cod with Snap Peas
Ingredients:
- 4 (5 ounce) cod fillets
- salt and ground black pepper to taste
- 3 tablespoons butter, melted
- 2 tablespoons sesame seeds
- vegetable oil
- 2 (6 ounce) packages sugar snap peas
- 3 cloves garlic, thinly sliced
- 1 medium orange, cut into wedges
Instructions:
1. Brush the air fryer basket with vegetable oil and preheat to 400 degrees F (200 degrees C).
- Thaw fish if frozen; blot dry with paper towels, and sprinkle lightly with salt and pepper.
- Stir together butter and sesame seeds in a small bowl. Set aside 2 tablespoons of the butter mixture for the fish. Toss peas and garlic with remaining butter mixture and place in the air fryer basket.
- Cook peas in the preheated air fryer in batches, if needed, until just tender, tossing once, about 10 minutes. Remove and keep warm while cooking fish.
- Brush fish with 1/2 of the remaining butter mixture. Place fillets in air fryer basket. Cook 4 minutes; turn fish. Brush with remaining butter mixture. Cook 5 to 6 minutes more or until fish begins to flake when tested with a fork. Serve with snap peas and orange wedges.
