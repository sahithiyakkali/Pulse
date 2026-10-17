# Pulse

A vegetarian protein tracker and budget meal planner. It finds the nutrients you are behind on this week, suggests quick cheap meals to close the gap, and plans a grocery run that gets the most meals out of what you buy.

It is a plain static website: no build step, no dependencies, no server.

## What it does

- Welcome flow that sets protein, fiber, and iron targets from your goal, weight, and activity
- Today and Week tabs: progress against targets, protein by day, cuisines eaten
- Meal suggestions that lean toward this week's gaps and keep a mix of cuisines
- Log meals, including your own foods, and past days this week
- Recipe cards with time, ingredients, steps, a servings scaler, and a "what I already have" checklist
- Grocery planner with a weekly budget, a "already in my kitchen" list, and a copyable shopping list
- Swaps for carb-heavy meals
- Back up, restore, and erase your data

## Files

- `index.html` page structure
- `styles.css` look and feel
- `data.js` ingredients, prices, meals, recipes, swaps
- `app.js` all logic

## Run it on your computer

Open `index.html` in a browser. Or, in this folder, run `python3 -m http.server 8000` and visit http://localhost:8000.

## Put it on GitHub

1. Make a free account at github.com and click **New repository**. Name it `pulse`. Public is simplest.
2. Unzip this folder. On the new repo page click **uploading an existing file**, drag in `index.html`, `styles.css`, `data.js`, `app.js`, `README.md`, and `.gitignore` (the files, not the zip), and click **Commit changes**.

## Deploy it free (pick one)

Menu names change now and then, so follow the closest match.

- **GitHub Pages:** repo **Settings**, then **Pages**. Set the source to **Deploy from a branch**, pick `main` and `/ (root)`, and save. After a minute the site is at `https://YOUR-USERNAME.github.io/pulse/`.
- **Netlify:** **Add new site**, **Import an existing project**, connect GitHub, pick the repo. Leave the build command empty and deploy.
- **Vercel:** **Add New**, **Project**, import the repo. Set Framework Preset to **Other**, leave build settings empty, and deploy.
- **Cloudflare Pages:** **Workers & Pages**, **Create**, **Pages**, connect the repo. No build command, output directory `/`.

After that, every change you push to `main` redeploys the site automatically. All four hosts let you attach a custom domain in their settings.

## Editing it

- **With Claude Code:** start it in this folder (see the Claude Code docs for install steps) and ask for changes, like "add a Korean breakfast meal." Review the changes, commit, and push.
- **By hand:** edit `data.js` to add meals. A meal looks like this, with the numbers being protein g, fiber g, iron mg, and minutes, then the ingredients it uses in servings:

```js
['id','Meal name','Cuisine',22,14,6,30,{len:1,rice:1,onion:1}]
```

Add its recipe to `R` using the same id: `id:["ingredient; ingredient","Step one.|Step two."]`. Ingredient keys, prices, and pack sizes live in `D`.

## Where your data lives

Everything is saved in the visitor's own browser (localStorage). Clearing browser data erases it, and it does not sync between devices. The Profile tab has Back up and Restore for moving data.

## Not working yet outside claude.ai

The "describe what you ate and get an estimate" box only shows up inside claude.ai, so on your own site it stays hidden. To add it you need a small server function that calls the Claude API, with your API key stored as a host environment variable. Never put an API key in `app.js`.

## Roadmap ideas

- Larger meal library and more cultures
- Real nutrition data (USDA FoodData Central) and local store prices
- Accounts and sync across devices (needs a hosted database and sign-in)
- Swap suggestions inside meal cards, and recipes for meals you describe
- Installable phone app (PWA)

## Notes

Prices and nutrition values are rough estimates, and targets are general guidelines, not medical advice.
