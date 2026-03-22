const STORAGE_KEY = "striker-fuel-state";

const appState = {
  profile: {
    playerName: "",
    position: "Forward",
    meatPreference: "yes",
    intensity: "high",
  },
  meals: [],
  workouts: [],
};

const targetsByIntensity = {
  high: { calories: 3200, protein: 165, carbs: 420, fats: 85, workload: 85 },
  moderate: { calories: 2800, protein: 150, carbs: 340, fats: 78, workload: 65 },
  light: { calories: 2400, protein: 140, carbs: 260, fats: 70, workload: 45 },
  recovery: { calories: 2200, protein: 135, carbs: 220, fats: 68, workload: 25 },
};

const foodDatabase = [
  {
    id: "rice-krispies-treat",
    name: "Rice Krispies Treat",
    aliases: ["rice krispy treat", "rice crispy treat", "rice krispies square"],
    calories: 90,
    protein: 1,
    carbs: 17,
    fats: 2,
    focus: "none",
    containsMeat: false,
    highlights: ["carbs"],
    swapId: null,
  },
  {
    id: "banana",
    name: "Banana",
    aliases: ["banana medium"],
    calories: 105,
    protein: 1,
    carbs: 27,
    fats: 0,
    focus: "magnesium",
    containsMeat: false,
    highlights: ["carbs", "magnesium"],
    swapId: null,
  },
  {
    id: "chocolate-milk",
    name: "Chocolate Milk",
    aliases: ["recovery milk"],
    calories: 190,
    protein: 8,
    carbs: 30,
    fats: 5,
    focus: "calcium",
    containsMeat: false,
    highlights: ["carbs", "calcium"],
    swapId: null,
  },
  {
    id: "greek-yogurt-berries",
    name: "Greek Yogurt With Berries",
    aliases: ["greek yogurt", "yogurt berries"],
    calories: 220,
    protein: 20,
    carbs: 24,
    fats: 4,
    focus: "calcium",
    containsMeat: false,
    highlights: ["protein", "calcium", "b12"],
    swapId: null,
  },
  {
    id: "protein-shake",
    name: "Protein Shake",
    aliases: ["protein drink", "whey shake"],
    calories: 160,
    protein: 30,
    carbs: 5,
    fats: 3,
    focus: "none",
    containsMeat: false,
    highlights: ["protein"],
    swapId: null,
  },
  {
    id: "overnight-oats",
    name: "Overnight Oats",
    aliases: ["oats", "oatmeal"],
    calories: 430,
    protein: 18,
    carbs: 63,
    fats: 12,
    focus: "magnesium",
    containsMeat: false,
    highlights: ["carbs", "magnesium"],
    swapId: null,
  },
  {
    id: "eggs-toast",
    name: "Eggs On Toast",
    aliases: ["eggs and toast"],
    calories: 290,
    protein: 17,
    carbs: 24,
    fats: 11,
    focus: "b12",
    containsMeat: false,
    highlights: ["protein", "b12"],
    swapId: null,
  },
  {
    id: "cottage-cheese-bowl",
    name: "Cottage Cheese With Pineapple",
    aliases: ["cottage cheese", "cottage cheese bowl"],
    calories: 240,
    protein: 25,
    carbs: 17,
    fats: 5,
    focus: "calcium",
    containsMeat: false,
    highlights: ["protein", "calcium", "b12"],
    swapId: null,
  },
  {
    id: "trail-mix",
    name: "Trail Mix",
    aliases: ["nuts and dried fruit"],
    calories: 310,
    protein: 8,
    carbs: 26,
    fats: 20,
    focus: "magnesium",
    containsMeat: false,
    highlights: ["calories", "magnesium"],
    swapId: null,
  },
  {
    id: "tofu-rice-bowl",
    name: "Tofu Rice Bowl",
    aliases: ["tofu bowl", "veggie rice bowl"],
    calories: 540,
    protein: 24,
    carbs: 66,
    fats: 18,
    focus: "iron",
    containsMeat: false,
    highlights: ["protein", "carbs", "iron"],
    swapId: null,
  },
  {
    id: "edamame-cup",
    name: "Edamame Cup",
    aliases: ["edamame"],
    calories: 190,
    protein: 18,
    carbs: 15,
    fats: 8,
    focus: "iron",
    containsMeat: false,
    highlights: ["protein", "iron"],
    swapId: null,
  },
  {
    id: "lentil-pasta",
    name: "Lentil Pasta Bowl",
    aliases: ["lentil pasta", "veggie pasta"],
    calories: 610,
    protein: 28,
    carbs: 92,
    fats: 12,
    focus: "iron",
    containsMeat: false,
    highlights: ["protein", "carbs", "iron"],
    swapId: null,
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast",
    aliases: ["avo toast"],
    calories: 300,
    protein: 8,
    carbs: 28,
    fats: 16,
    focus: "magnesium",
    containsMeat: false,
    highlights: ["calories", "magnesium"],
    swapId: null,
  },
  {
    id: "chicken-rice-bowl",
    name: "Chicken Rice Bowl",
    aliases: ["chicken bowl", "chicken rice"],
    calories: 640,
    protein: 42,
    carbs: 72,
    fats: 16,
    focus: "iron",
    containsMeat: true,
    highlights: ["protein", "carbs", "iron", "b12"],
    swapId: "tofu-rice-bowl",
  },
  {
    id: "turkey-sandwich",
    name: "Turkey Sandwich",
    aliases: ["turkey sub"],
    calories: 420,
    protein: 30,
    carbs: 45,
    fats: 12,
    focus: "b12",
    containsMeat: true,
    highlights: ["protein", "b12"],
    swapId: "cottage-cheese-bowl",
  },
  {
    id: "steak-burrito-bowl",
    name: "Steak Burrito Bowl",
    aliases: ["steak bowl", "burrito bowl"],
    calories: 710,
    protein: 40,
    carbs: 70,
    fats: 24,
    focus: "iron",
    containsMeat: true,
    highlights: ["protein", "iron", "b12"],
    swapId: "lentil-pasta",
  },
  {
    id: "salmon-potatoes",
    name: "Salmon With Potatoes",
    aliases: ["salmon and potatoes"],
    calories: 620,
    protein: 39,
    carbs: 48,
    fats: 26,
    focus: "omega3",
    containsMeat: true,
    highlights: ["protein", "omega3"],
    swapId: "tofu-rice-bowl",
  },
  {
    id: "pasta-meat-sauce",
    name: "Pasta With Meat Sauce",
    aliases: ["meat sauce pasta", "beef pasta"],
    calories: 680,
    protein: 34,
    carbs: 88,
    fats: 20,
    focus: "b12",
    containsMeat: true,
    highlights: ["protein", "carbs", "b12"],
    swapId: "lentil-pasta",
  },
];

const workoutLibrary = {
  Forward: [
    {
      id: "forward-speed",
      title: "Explosive Finishing Circuit",
      category: "speed",
      duration: 50,
      effort: 8,
      reason: "Prioritize repeat sprint quality and final-third sharpness.",
    },
    {
      id: "forward-strength",
      title: "Single-Leg Strength + Deceleration",
      category: "strength",
      duration: 55,
      effort: 8,
      reason: "Build power for cutbacks, presses, and collision stability.",
    },
    {
      id: "forward-conditioning",
      title: "Tempo Run + Recovery Mobility",
      category: "conditioning",
      duration: 40,
      effort: 6,
      reason: "Raise work capacity without overloading your legs.",
    },
  ],
  Midfielder: [
    {
      id: "mid-conditioning",
      title: "Aerobic Intervals With Turn Mechanics",
      category: "conditioning",
      duration: 52,
      effort: 7,
      reason: "Support total distance and repeat efforts across both halves.",
    },
    {
      id: "mid-strength",
      title: "Lower-Body Strength Pyramid",
      category: "strength",
      duration: 58,
      effort: 8,
      reason: "Improve duel strength and maintain posture late in matches.",
    },
    {
      id: "mid-technical",
      title: "Ball Mastery Under Fatigue",
      category: "technical",
      duration: 45,
      effort: 7,
      reason: "Keep first touch sharp after repeated high-intensity work.",
    },
  ],
  Defender: [
    {
      id: "def-speed",
      title: "Acceleration + Backward Sprint Transitions",
      category: "speed",
      duration: 48,
      effort: 8,
      reason: "Improve recovery runs and first-step defending.",
    },
    {
      id: "def-strength",
      title: "Posterior-Chain Strength Session",
      category: "strength",
      duration: 56,
      effort: 8,
      reason: "Support tackling force and aerial duel explosiveness.",
    },
    {
      id: "def-mobility",
      title: "Mobility + Trunk Control Block",
      category: "mobility",
      duration: 32,
      effort: 4,
      reason: "Reduce stiffness while supporting rotational stability.",
    },
  ],
  Goalkeeper: [
    {
      id: "gk-strength",
      title: "Lateral Power + Landing Mechanics",
      category: "strength",
      duration: 48,
      effort: 7,
      reason: "Protect shoulders and hips while increasing dive power.",
    },
    {
      id: "gk-speed",
      title: "Reaction Footwork + Short Burst Repeats",
      category: "speed",
      duration: 38,
      effort: 8,
      reason: "Sharpen set position resets and box movement.",
    },
    {
      id: "gk-mobility",
      title: "Thoracic Mobility Recovery Flow",
      category: "mobility",
      duration: 28,
      effort: 3,
      reason: "Offset repeated diving and overhead stress.",
    },
  ],
};

const profileForm = document.querySelector("#profile-form");
const mealForm = document.querySelector("#meal-form");
const workoutForm = document.querySelector("#workout-form");
const mealList = document.querySelector("#meal-list");
const workoutList = document.querySelector("#workout-list");
const nutritionAnalysis = document.querySelector("#nutrition-analysis");
const recommendationList = document.querySelector("#recommendation-list");
const entryTemplate = document.querySelector("#entry-template");
const foodOptions = document.querySelector("#food-options");
const foodSuggestions = document.querySelector("#food-suggestions");
const foodMatch = document.querySelector("#food-match");
const workoutTemplates = document.querySelector("#workout-templates");
const mealHelper = document.querySelector("#meal-helper");
const mealNameInput = document.querySelector("#meal-name");
const mealServingsInput = document.querySelector("#meal-servings");
const mealCaloriesInput = document.querySelector("#meal-calories");
const mealProteinInput = document.querySelector("#meal-protein");
const mealCarbsInput = document.querySelector("#meal-carbs");
const mealFatsInput = document.querySelector("#meal-fats");
const mealFocusSelect = document.querySelector("#meal-focus");
const resetDayButton = document.querySelector("#reset-day");

let activeFoodId = null;

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    Object.assign(appState.profile, parsed.profile || {});
    appState.meals = Array.isArray(parsed.meals)
      ? parsed.meals.map((meal) => ({
          name: meal.name || "",
          calories: Number(meal.calories) || 0,
          protein: Number(meal.protein) || 0,
          carbs: Number(meal.carbs) || 0,
          fats: Number(meal.fats) || 0,
          focus: meal.focus || "none",
          servings: Number(meal.servings) || 1,
          source: meal.source || "manual",
          foodId: meal.foodId || null,
          highlights: Array.isArray(meal.highlights) ? meal.highlights : meal.focus && meal.focus !== "none" ? [meal.focus] : [],
        }))
      : [];
    appState.workouts = Array.isArray(parsed.workouts)
      ? parsed.workouts.map((workout) => ({
          name: workout.name || "",
          category: workout.category || "speed",
          duration: Number(workout.duration) || 0,
          effort: Number(workout.effort) || 1,
        }))
      : [];
  } catch (error) {
    console.error("Unable to load saved state", error);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function hydrateForms() {
  document.querySelector("#player-name").value = appState.profile.playerName;
  document.querySelector("#position").value = appState.profile.position;
  document.querySelector("#meat-preference").value = appState.profile.meatPreference;
  document.querySelector("#intensity").value = appState.profile.intensity;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function formatAmount(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatServings(value) {
  const amount = formatAmount(value);
  return `${amount} serving${Number(value) === 1 ? "" : "s"}`;
}

function getTargets() {
  return targetsByIntensity[appState.profile.intensity] || targetsByIntensity.high;
}

function getAllowedFoods() {
  return foodDatabase.filter((food) => appState.profile.meatPreference === "yes" || !food.containsMeat);
}

function getFoodById(foodId) {
  return foodDatabase.find((food) => food.id === foodId) || null;
}

function searchFoods(query, limit = 6) {
  const normalizedQuery = normalizeText(query);
  const foods = getAllowedFoods();

  if (!normalizedQuery) {
    return buildSmartFoodSuggestions().slice(0, limit);
  }

  return foods
    .map((food) => {
      const allTerms = [food.name, ...food.aliases].map(normalizeText);
      let score = 0;

      allTerms.forEach((term) => {
        if (term === normalizedQuery) score += 300;
        if (term.startsWith(normalizedQuery)) score += 180;
        if (term.includes(normalizedQuery)) score += 120;
      });

      normalizedQuery.split(" ").forEach((word) => {
        if (word && allTerms.some((term) => term.includes(word))) score += 30;
      });

      return { food, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((entry) => entry.food);
}

function findExactFood(query, foods = getAllowedFoods()) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;

  return (
    foods.find((food) => normalizeText(food.name) === normalizedQuery) ||
    foods.find((food) => food.aliases.some((alias) => normalizeText(alias) === normalizedQuery)) ||
    null
  );
}

function findBlockedFood(query) {
  if (appState.profile.meatPreference === "yes") return null;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return null;

  return (
    foodDatabase.find((food) => food.containsMeat && normalizeText(food.name) === normalizedQuery) ||
    foodDatabase.find((food) => food.containsMeat && food.aliases.some((alias) => normalizeText(alias) === normalizedQuery)) ||
    null
  );
}

function updateFoodOptions() {
  foodOptions.innerHTML = "";
  getAllowedFoods().forEach((food) => {
    const option = document.createElement("option");
    option.value = food.name;
    foodOptions.appendChild(option);
  });
}

function setMatchCard(content) {
  foodMatch.innerHTML = "";
  foodMatch.appendChild(content);
}

function createMatchCard(food, extraText = "", isPreview = false) {
  const wrapper = document.createElement("div");
  const title = document.createElement("h3");
  const servingCount = Math.max(Number(mealServingsInput.value) || 1, 0.5);
  const calories = food.calories * servingCount;
  const protein = food.protein * servingCount;
  const carbs = food.carbs * servingCount;
  const fats = food.fats * servingCount;

  title.textContent = isPreview ? `Closest match: ${food.name}` : `${food.name} matched`;
  wrapper.appendChild(title);

  const description = document.createElement("p");
  description.textContent =
    extraText ||
    `${formatServings(servingCount)} gives about ${formatAmount(calories)} kcal, ${formatAmount(
      protein
    )} g protein, ${formatAmount(carbs)} g carbs, and ${formatAmount(fats)} g fats.`;
  wrapper.appendChild(description);

  const meta = document.createElement("div");
  meta.className = "match-meta";

  const focusPill = document.createElement("span");
  focusPill.className = "match-pill";
  focusPill.textContent = food.focus === "none" ? "General fuel" : `Focus: ${food.focus}`;
  meta.appendChild(focusPill);

  const profilePill = document.createElement("span");
  profilePill.className = "match-pill";
  profilePill.textContent = food.containsMeat ? "Contains meat" : "Meat-free";
  meta.appendChild(profilePill);

  wrapper.appendChild(meta);

  return wrapper;
}

function renderFoodLookup() {
  const query = mealNameInput.value.trim();
  const exactFood = findExactFood(query);
  const blockedFood = findBlockedFood(query);
  let suggestedFoods = searchFoods(query);

  foodSuggestions.innerHTML = "";

  if (exactFood) {
    activeFoodId = exactFood.id;
    applyFoodToForm(exactFood, true);
    setMatchCard(createMatchCard(exactFood));
    mealHelper.textContent = `Matched ${exactFood.name}. You can still edit the macros if needed.`;
    suggestedFoods = buildSmartFoodSuggestions();
  } else if (blockedFood) {
    activeFoodId = null;
    const replacement = blockedFood.swapId ? getFoodById(blockedFood.swapId) : null;
    const wrapper = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${blockedFood.name} does not fit your no-meat profile`;
    wrapper.appendChild(title);

    const description = document.createElement("p");
    description.textContent = replacement
      ? `Try ${replacement.name} instead for a similar role in your plan.`
      : "Try one of the meat-free suggestions below instead.";
    wrapper.appendChild(description);
    setMatchCard(wrapper);

    mealHelper.textContent = "Showing meat-free alternatives based on your profile.";
    suggestedFoods = replacement ? [replacement, ...buildSmartFoodSuggestions()] : buildSmartFoodSuggestions();
  } else if (query) {
    activeFoodId = null;
    if (suggestedFoods.length) {
      setMatchCard(
        createMatchCard(
          suggestedFoods[0],
          `No exact match yet. Tap a suggestion or keep typing. Closest match is ${suggestedFoods[0].name}.`,
          true
        )
      );
      mealHelper.textContent = "Pick a suggestion for autofill, or keep typing if this is a custom meal.";
    } else {
      const wrapper = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = "Custom meal";
      wrapper.appendChild(title);

      const description = document.createElement("p");
      description.textContent = "No built-in match found. You can still enter the macros manually.";
      wrapper.appendChild(description);
      setMatchCard(wrapper);
      mealHelper.textContent = "No built-in match found. Use the macro fields manually for this meal.";
    }
  } else {
    activeFoodId = null;
    const wrapper = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = "Smart food lookup";
    wrapper.appendChild(title);

    const description = document.createElement("p");
    description.textContent = "Type a food to autofill macros, or tap one of the suggested options below.";
    wrapper.appendChild(description);
    setMatchCard(wrapper);
    mealHelper.textContent =
      "Type a food like Rice Krispies Treat, banana, chicken rice bowl, or tofu rice bowl to auto-fill macros.";
    suggestedFoods = buildSmartFoodSuggestions();
  }

  renderFoodSuggestions(suggestedFoods);
}

function renderFoodSuggestions(foods) {
  const uniqueFoods = [];
  const seen = new Set();

  foods.forEach((food) => {
    if (!food || seen.has(food.id)) return;
    seen.add(food.id);
    uniqueFoods.push(food);
  });

  uniqueFoods.slice(0, 6).forEach((food) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip-button";
    button.textContent = food.name;
    button.addEventListener("click", () => {
      activeFoodId = food.id;
      applyFoodToForm(food, true);
      setMatchCard(createMatchCard(food));
      mealHelper.textContent = `${food.name} loaded into the meal form.`;
      mealNameInput.focus();
    });
    foodSuggestions.appendChild(button);
  });

  if (!uniqueFoods.length) {
    const empty = document.createElement("span");
    empty.className = "chip-static";
    empty.textContent = "No suggested foods yet";
    foodSuggestions.appendChild(empty);
  }
}

function applyFoodToForm(food, replaceName) {
  const servings = Math.max(Number(mealServingsInput.value) || 1, 0.5);
  if (replaceName) mealNameInput.value = food.name;
  mealCaloriesInput.value = formatAmount(food.calories * servings);
  mealProteinInput.value = formatAmount(food.protein * servings);
  mealCarbsInput.value = formatAmount(food.carbs * servings);
  mealFatsInput.value = formatAmount(food.fats * servings);
  mealFocusSelect.value = food.focus;
}

function syncFoodMacrosToServings() {
  if (!activeFoodId) return;
  const food = getFoodById(activeFoodId);
  if (!food) return;
  applyFoodToForm(food, false);
  setMatchCard(createMatchCard(food));
}

function getNutritionTotals() {
  return appState.meals.reduce(
    (totals, meal) => {
      totals.calories += Number(meal.calories);
      totals.protein += Number(meal.protein);
      totals.carbs += Number(meal.carbs);
      totals.fats += Number(meal.fats);
      totals.focuses.push(meal.focus);
      totals.highlights.push(...(meal.highlights || []));
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0, focuses: [], highlights: [] }
  );
}

function getWorkoutTotals() {
  return appState.workouts.reduce(
    (totals, workout) => {
      const load = Number(workout.duration) * Number(workout.effort) * 0.2;
      totals.duration += Number(workout.duration);
      totals.load += load;
      totals.categories.push(workout.category);
      return totals;
    },
    { duration: 0, load: 0, categories: [] }
  );
}

function setStat(metric, total, target, unit) {
  const totalNode = document.querySelector(`#${metric}-total`);
  const targetNode = document.querySelector(`#${metric}-target`);
  const fillNode = document.querySelector(`#${metric}-fill`);
  const percent = target > 0 ? Math.min((total / target) * 100, 100) : 0;
  const difference = target - total;

  totalNode.textContent = `${Math.round(total)}${unit ? ` ${unit}` : ""}`;
  if (difference > 0) {
    targetNode.textContent = `Target ${target}${unit ? ` ${unit}` : ""} | ${Math.round(difference)}${unit ? ` ${unit}` : ""} left`;
  } else {
    targetNode.textContent = `Target ${target}${unit ? ` ${unit}` : ""} | ${Math.abs(Math.round(difference))}${unit ? ` ${unit}` : ""} over`;
  }
  fillNode.style.width = `${percent}%`;
}

function renderStats() {
  const targets = getTargets();
  const meals = getNutritionTotals();
  const training = getWorkoutTotals();
  const playerName = appState.profile.playerName || "Player";

  document.querySelector("#welcome-message").textContent = `${playerName}, your ${appState.profile.intensity} day targets are tuned for a ${appState.profile.position.toLowerCase()}.`;
  setStat("calories", meals.calories, targets.calories, "kcal");
  setStat("protein", meals.protein, targets.protein, "g");
  setStat("carbs", meals.carbs, targets.carbs, "g");
  setStat("workload", training.load, targets.workload, "pts");
}

function renderEntries(listElement, items, describeItem, removeHandler) {
  listElement.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nothing logged yet.";
    listElement.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const fragment = entryTemplate.content.cloneNode(true);
    fragment.querySelector(".entry-title").textContent = item.name;
    fragment.querySelector(".entry-subtitle").textContent = describeItem(item);
    fragment.querySelector(".ghost-button").addEventListener("click", () => removeHandler(index));
    listElement.appendChild(fragment);
  });
}

function uniqueFoodsFromIds(ids) {
  const seen = new Set();
  return ids
    .map((id) => getFoodById(id))
    .filter((food) => {
      if (!food || seen.has(food.id)) return false;
      if (appState.profile.meatPreference === "no" && food.containsMeat) return false;
      seen.add(food.id);
      return true;
    });
}

function chooseFoodForNeed(need) {
  const foods = getAllowedFoods();

  if (need === "protein") {
    return [...foods].sort((left, right) => right.protein - left.protein)[0] || null;
  }

  if (need === "carbs") {
    return [...foods].sort((left, right) => right.carbs - left.carbs)[0] || null;
  }

  if (need === "calories") {
    return [...foods].sort((left, right) => right.calories - left.calories)[0] || null;
  }

  return foods.find((food) => food.highlights.includes(need)) || null;
}

function buildSmartFoodSuggestions() {
  const totals = getNutritionTotals();
  const targets = getTargets();
  const suggestions = [];
  const carbGap = targets.carbs - totals.carbs;
  const proteinGap = targets.protein - totals.protein;
  const calorieGap = targets.calories - totals.calories;
  const highlightSet = new Set([...totals.focuses, ...totals.highlights].filter(Boolean));

  if (carbGap > 60) {
    suggestions.push("banana", "rice-krispies-treat", "chocolate-milk", "overnight-oats");
  }

  if (proteinGap > 25) {
    suggestions.push("protein-shake", "greek-yogurt-berries");
    suggestions.push(appState.profile.meatPreference === "yes" ? "chicken-rice-bowl" : "tofu-rice-bowl");
  }

  if (calorieGap > 400) {
    suggestions.push(appState.profile.meatPreference === "yes" ? "steak-burrito-bowl" : "lentil-pasta");
    suggestions.push("trail-mix");
  }

  if (!highlightSet.has("omega3")) {
    suggestions.push(appState.profile.meatPreference === "yes" ? "salmon-potatoes" : "tofu-rice-bowl");
  }

  if (!highlightSet.has("calcium")) {
    suggestions.push("greek-yogurt-berries", "chocolate-milk");
  }

  if (appState.profile.meatPreference === "no" && !highlightSet.has("b12")) {
    suggestions.push("eggs-toast", "cottage-cheese-bowl");
  }

  suggestions.push("banana", "protein-shake", "tofu-rice-bowl", "chocolate-milk");
  return uniqueFoodsFromIds(suggestions).slice(0, 6);
}

function buildCoachNote() {
  const totals = getNutritionTotals();
  const targets = getTargets();
  const workouts = getWorkoutTotals();
  const carbGap = Math.max(targets.carbs - totals.carbs, 0);
  const proteinGap = Math.max(targets.protein - totals.protein, 0);
  const calorieGap = Math.max(targets.calories - totals.calories, 0);
  const nextWorkout = getPrimaryWorkoutTemplate();

  if (carbGap > 80) {
    const bestFood = chooseFoodForNeed("carbs");
    return {
      title: "Carbs are the priority",
      text: bestFood
        ? `You are still about ${Math.round(carbGap)} g short. Best quick fix: ${bestFood.name}.`
        : `You are still about ${Math.round(carbGap)} g short. Add a carb-focused snack or meal soon.`,
    };
  }

  if (proteinGap > 30) {
    const bestFood = chooseFoodForNeed("protein");
    return {
      title: "Close the protein gap",
      text: bestFood
        ? `You still need around ${Math.round(proteinGap)} g protein. ${bestFood.name} is a strong next option.`
        : `You still need around ${Math.round(proteinGap)} g protein. Add a high-protein meal or shake next.`,
    };
  }

  if (calorieGap > 450) {
    const bestFood = chooseFoodForNeed("calories");
    return {
      title: "Energy intake is light",
      text: bestFood
        ? `You are roughly ${Math.round(calorieGap)} kcal short. ${bestFood.name} will move the day fastest.`
        : `You are roughly ${Math.round(calorieGap)} kcal short. Add a larger meal before training or recovery.`,
    };
  }

  if (workouts.load > targets.workload + 15) {
    return {
      title: "Shift into recovery mode",
      text: "Your workload is already above plan. Favor mobility, fluids, and easy carbs for the rest of the day.",
    };
  }

  if (workouts.load < targets.workload * 0.55 && nextWorkout) {
    return {
      title: "You still have room for a quality session",
      text: `${nextWorkout.title} is the cleanest next workout based on your position and recent training balance.`,
    };
  }

  return {
    title: "The day is fairly balanced",
    text: "Keep stacking consistent fueling and avoid adding extra fatigue unless the next workout is planned.",
  };
}

function renderCoachNote() {
  const note = buildCoachNote();
  document.querySelector("#coach-note-title").textContent = note.title;
  document.querySelector("#coach-note-text").textContent = note.text;
}

function getPositionLibrary() {
  return workoutLibrary[appState.profile.position] || workoutLibrary.Forward;
}

function getPrimaryWorkoutTemplate() {
  const library = getPositionLibrary();
  const recentCategories = getWorkoutTotals().categories.slice(0, 4);
  const preferredCategory = ["speed", "strength", "conditioning", "mobility", "technical"].find(
    (category) => !recentCategories.includes(category)
  );

  return library.find((item) => item.category === preferredCategory) || library[0] || null;
}

function renderWorkoutTemplates() {
  workoutTemplates.innerHTML = "";
  const library = getPositionLibrary();
  const ordered = [getPrimaryWorkoutTemplate(), ...library].filter(Boolean);
  const seen = new Set();

  ordered.forEach((template) => {
    if (seen.has(template.id)) return;
    seen.add(template.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip-button";
    button.textContent = template.title;
    button.addEventListener("click", () => {
      applyWorkoutTemplate(template);
      workoutForm.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    workoutTemplates.appendChild(button);
  });
}

function applyWorkoutTemplate(template) {
  document.querySelector("#workout-name").value = template.title;
  document.querySelector("#workout-category").value = template.category;
  document.querySelector("#workout-duration").value = template.duration;
  document.querySelector("#workout-effort").value = template.effort;
}

function buildNutritionAnalysis() {
  const totals = getNutritionTotals();
  const targets = getTargets();
  const workload = getWorkoutTotals();
  const items = [];
  const highlightSet = new Set([...totals.focuses, ...totals.highlights].filter((item) => item && item !== "none"));
  const calorieGap = targets.calories - totals.calories;
  const proteinGap = targets.protein - totals.protein;
  const carbGap = targets.carbs - totals.carbs;

  if (calorieGap > 250) {
    const bestFood = chooseFoodForNeed("calories");
    items.push({
      title: `Energy is low by about ${Math.round(calorieGap)} kcal`,
      text: bestFood
        ? `${bestFood.name} is a good next add for fast recovery energy.`
        : "Add a larger meal or recovery snack to close the gap.",
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (proteinGap > 20) {
    const bestFood = chooseFoodForNeed("protein");
    items.push({
      title: `Protein is low by about ${Math.round(proteinGap)} g`,
      text: appState.profile.meatPreference === "yes"
        ? `${bestFood ? bestFood.name : "A high-protein meal"} can help repair muscle from training.`
        : `${bestFood ? bestFood.name : "A high-protein vegetarian meal"} can help close the gap without meat.`,
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (carbGap > 40) {
    const bestFood = chooseFoodForNeed("carbs");
    items.push({
      title: `Carbs are low by about ${Math.round(carbGap)} g`,
      text: bestFood
        ? `${bestFood.name} is a strong option if you need quick soccer fuel before or after work.`
        : "Add easy carbs such as fruit, oats, rice, pasta, or a sports snack.",
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (!highlightSet.has("omega3")) {
    const bestFood = chooseFoodForNeed("omega3");
    items.push({
      title: "Omega-3 support is missing",
      text: bestFood
        ? `${bestFood.name} is a good recovery choice for joint and inflammation support.`
        : "Add an omega-3 source today if possible.",
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (!highlightSet.has("calcium")) {
    const bestFood = chooseFoodForNeed("calcium");
    items.push({
      title: "Calcium support is still light",
      text: bestFood
        ? `${bestFood.name} can help support bone health and recovery.`
        : "Add a calcium-rich food today.",
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (appState.profile.meatPreference === "no" && !highlightSet.has("b12")) {
    const bestFood = chooseFoodForNeed("b12");
    items.push({
      title: "Vitamin B12 needs an intentional source",
      text: bestFood
        ? `${bestFood.name} is a practical way to cover more of that need on a no-meat plan.`
        : "Consider eggs, dairy, fortified foods, or supplementation if appropriate.",
      actionLabel: bestFood ? `Use ${bestFood.name}` : "",
      actionType: bestFood ? "food" : "",
      foodId: bestFood ? bestFood.id : "",
    });
  }

  if (workload.load > targets.workload + 20) {
    items.push({
      title: "Training load is elevated",
      text: "You pushed past the planned workload. Favor hydration, easy carbs, and a lighter next session.",
    });
  }

  return items.length
    ? items
    : [
        {
          title: "Your daily fueling looks balanced",
          text: "You are in a solid range on food and training so far. Keep recovery habits steady.",
        },
      ];
}

function buildWorkoutRecommendations() {
  const library = getPositionLibrary();
  const workoutTotals = getWorkoutTotals();
  const recentCategories = workoutTotals.categories.slice(0, 4);
  const targets = getTargets();
  const primary = getPrimaryWorkoutTemplate();
  const mobilityTemplate = library.find((item) => item.category === "mobility");
  const strengthTemplate = library.find((item) => item.category === "strength");
  const recommendations = [];

  if (workoutTotals.load < targets.workload * 0.65 && primary) {
    recommendations.push({
      title: primary.title,
      text: `${primary.reason} Current workload is below target, so this is the best next session.`,
      actionLabel: "Load this workout",
      actionType: "workout",
      workoutId: primary.id,
    });
  } else if (workoutTotals.load <= targets.workload) {
    recommendations.push({
      title: "Progressive overload block",
      text: "Keep the next session efficient by increasing one variable only: a few minutes, one set, or slightly more effort.",
    });
  } else {
    recommendations.push({
      title: "Recovery-first session",
      text: "You are already above target workload. Choose mobility, ball touches, or easy technical work instead of another hard session.",
      actionLabel: mobilityTemplate ? "Load mobility session" : "",
      actionType: mobilityTemplate ? "workout" : "",
      workoutId: mobilityTemplate ? mobilityTemplate.id : "",
    });
  }

  if (!recentCategories.includes("strength") && strengthTemplate) {
    recommendations.push({
      title: "Add lower-body strength this week",
      text: "Soccer progression usually stalls when strength work disappears. Get at least one lower-body strength exposure in.",
      actionLabel: "Load strength session",
      actionType: "workout",
      workoutId: strengthTemplate.id,
    });
  }

  if (!recentCategories.includes("mobility") && mobilityTemplate) {
    recommendations.push({
      title: "Schedule a mobility reset",
      text: "A short hip, ankle, and thoracic spine session can improve movement efficiency and help you recover better.",
      actionLabel: "Load mobility session",
      actionType: "workout",
      workoutId: mobilityTemplate.id,
    });
  }

  return recommendations;
}

function renderAnalysis() {
  renderAnalysisItems(nutritionAnalysis, buildNutritionAnalysis());
  renderAnalysisItems(recommendationList, buildWorkoutRecommendations());
}

function renderAnalysisItems(container, items) {
  container.innerHTML = "";

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "analysis-item";

    const title = document.createElement("h3");
    title.textContent = item.title;
    article.appendChild(title);

    const text = document.createElement("p");
    text.textContent = item.text;
    article.appendChild(text);

    if (item.actionType === "food" && item.foodId) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button";
      button.textContent = item.actionLabel;
      button.addEventListener("click", () => {
        const food = getFoodById(item.foodId);
        if (!food) return;
        activeFoodId = food.id;
        applyFoodToForm(food, true);
        setMatchCard(createMatchCard(food));
        mealHelper.textContent = `${food.name} loaded into the meal form.`;
        mealForm.scrollIntoView({ behavior: "smooth", block: "center" });
        mealNameInput.focus();
      });
      article.appendChild(button);
    }

    if (item.actionType === "workout" && item.workoutId) {
      const template = getPositionLibrary().find((entry) => entry.id === item.workoutId);
      if (template) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "ghost-button";
        button.textContent = item.actionLabel;
        button.addEventListener("click", () => {
          applyWorkoutTemplate(template);
          workoutForm.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        article.appendChild(button);
      }
    }

    container.appendChild(article);
  });
}

function removeMeal(index) {
  appState.meals.splice(index, 1);
  syncUI();
}

function removeWorkout(index) {
  appState.workouts.splice(index, 1);
  syncUI();
}

function resetMealForm() {
  mealForm.reset();
  activeFoodId = null;
  mealServingsInput.value = 1;
  mealFocusSelect.value = "none";
  mealCaloriesInput.value = "";
  mealProteinInput.value = "";
  mealCarbsInput.value = "";
  mealFatsInput.value = "";
  renderFoodLookup();
}

function syncUI() {
  persistState();
  updateFoodOptions();
  renderStats();
  renderCoachNote();
  renderWorkoutTemplates();
  renderFoodLookup();
  renderEntries(
    mealList,
    appState.meals,
    (meal) =>
      `${formatServings(meal.servings || 1)}, ${meal.calories} kcal, ${meal.protein} g protein, ${meal.carbs} g carbs, ${meal.fats} g fats${
        meal.source === "lookup" ? ", smart lookup" : ""
      }`,
    removeMeal
  );
  renderEntries(
    workoutList,
    appState.workouts,
    (workout) =>
      `${workout.category}, ${workout.duration} min at effort ${workout.effort}/10, load ${Math.round(
        Number(workout.duration) * Number(workout.effort) * 0.2
      )}`,
    removeWorkout
  );
  renderAnalysis();
}

function syncProfileFromForm() {
  const formData = new FormData(profileForm);
  appState.profile = {
    playerName: String(formData.get("playerName") || "").trim(),
    position: String(formData.get("position") || "Forward"),
    meatPreference: String(formData.get("meatPreference") || "yes"),
    intensity: String(formData.get("intensity") || "high"),
  };
  syncUI();
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  syncProfileFromForm();
});

profileForm.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("change", syncProfileFromForm);
});

mealNameInput.addEventListener("input", () => {
  renderFoodLookup();
});

mealServingsInput.addEventListener("input", () => {
  syncFoodMacrosToServings();
});

mealForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(mealForm);
  const matchedFood = activeFoodId ? getFoodById(activeFoodId) : null;
  const focus = String(formData.get("focus") || "none");

  appState.meals.unshift({
    name: String(formData.get("mealName") || "").trim(),
    calories: Number(formData.get("calories") || 0),
    protein: Number(formData.get("protein") || 0),
    carbs: Number(formData.get("carbs") || 0),
    fats: Number(formData.get("fats") || 0),
    focus,
    servings: Number(formData.get("servings") || 1),
    source: matchedFood ? "lookup" : "manual",
    foodId: matchedFood ? matchedFood.id : null,
    highlights: matchedFood
      ? [...matchedFood.highlights, ...(focus !== "none" ? [focus] : [])]
      : focus !== "none"
        ? [focus]
        : [],
  });

  resetMealForm();
  syncUI();
});

workoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(workoutForm);
  appState.workouts.unshift({
    name: String(formData.get("workoutName") || "").trim(),
    category: String(formData.get("category") || "speed"),
    duration: Number(formData.get("duration") || 0),
    effort: Number(formData.get("effort") || 1),
  });
  workoutForm.reset();
  syncUI();
});

resetDayButton.addEventListener("click", () => {
  if (!window.confirm("Reset today's food and workout logs?")) return;
  appState.meals = [];
  appState.workouts = [];
  resetMealForm();
  workoutForm.reset();
  syncUI();
});

loadState();
hydrateForms();
updateFoodOptions();
renderFoodLookup();
syncUI();
