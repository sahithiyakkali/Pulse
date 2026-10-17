// Pulse data: ingredients, meals, swaps, recipes. Edit this file to add or change meals.
const D={len:['Red lentils (1 lb)',2.2,9],chk:['Canned chickpeas',1.1,3],bbn:['Canned black beans',1,3],tofu:['Firm tofu block',2.5,4],egg:['Eggs (dozen)',3.5,12],yog:['Greek yogurt (32 oz)',5,8],rice:['Rice (2 lb)',2.5,16],oat:['Rolled oats',3.5,12],tort:['Tortillas or pita',2.8,10],pan:['Paneer (8 oz)',4.5,3],pb:['Peanut butter',3,14],spin:['Spinach bag',2.5,4],onion:['Onions and canned tomatoes',3,8],edam:['Frozen edamame',2.5,5],cot:['Cottage cheese',3.5,4],brc:['Frozen broccoli',2,5],pasta:['Pasta or noodles',1.5,8],feta:['Feta or shredded cheese',3.5,6],veg:['Cucumber, peppers, salsa',3,6]};
const M=[
['dal','Masoor dal with rice','Indian',22,14,6,30,{len:1,rice:1,onion:1}],
['chana','Chana masala with rice','Indian',17,15,5,25,{chk:1,onion:1,rice:1}],
['palak','Palak paneer wrap','Indian',24,5,4,25,{pan:1,spin:1,tort:1}],
['bhurji','Tofu bhurji wrap','Indian',26,5,4,15,{tofu:1,onion:1,tort:1}],
['bowl','Black bean burrito bowl','Mexican',19,15,4,15,{bbn:1,rice:1,veg:1}],
['quesa','Black bean quesadilla','Mexican',20,9,3,15,{feta:1,bbn:1,tort:1}],
['huev','Huevos rancheros','Mexican',18,8,3,15,{egg:2,tort:1,onion:1}],
['pnut','Peanut tofu stir-fry','East Asian',28,7,4,20,{tofu:1,pb:1,rice:1,brc:1}],
['efr','Edamame egg fried rice','East Asian',22,8,3,20,{edam:1,egg:1,rice:1,brc:1}],
['ceb','Chickpea edamame rice bowl','East Asian',20,14,5,15,{chk:1,edam:1,rice:1}],
['bibi','Egg bibimbap bowl','Korean',19,6,4,20,{egg:2,rice:1,spin:1}],
['kdub','Korean-style tofu rice bowl','Korean',24,6,4,15,{tofu:1,rice:1,veg:1}],
['thai','Peanut tofu noodles','Thai',27,6,4,20,{tofu:1,pb:1,pasta:1,veg:1}],
['omel','Spinach feta omelet','Mediterranean',20,3,4,10,{egg:3,spin:1,feta:1}],
['chsal','Chickpea cucumber salad with feta','Mediterranean',16,12,4,10,{chk:1,veg:1,feta:1}],
['cotb','Cottage cheese chickpea bowl','Mediterranean',26,8,3,5,{cot:1,chk:1,veg:1}],
['shak','Shakshuka with pita','Middle Eastern',17,6,4,20,{egg:2,onion:1,tort:1}],
['hum','Chickpea hummus wrap','Middle Eastern',16,11,4,10,{chk:1,veg:1,tort:1}],
['misr','Ethiopian-style lentil stew','Ethiopian',21,13,6,30,{len:1,onion:1,spin:1}],
['lpas','Lentil tomato pasta','Italian',21,12,5,25,{len:1,pasta:1,onion:1}],
['oatb','Greek yogurt oat bowl with peanut butter','Breakfast',24,7,2,5,{yog:1,oat:1,pb:1}]
].map(a=>({id:a[0],n:a[1],c:a[2],P:a[3],F:a[4],Fe:a[5],t:a[6],ing:a[7]}));
const MM=Object.fromEntries(M.map(m=>[m.id,m]));
const ANIMAL=['egg','yog','pan','cot','feta'];
const CU=['Indian','Mexican','East Asian','Korean','Thai','Mediterranean','Middle Eastern','Ethiopian','Italian'];
const NUT=[['P','Protein','g','--pro'],['F','Fiber','g','--fib'],['Fe','Iron','mg','--iron']];
const BASE={build:.7,lean:.7,keep:.55,health:.4},ACT={light:.9,moderate:1,heavy:1.1},MIX={fav:[1.5,.95],mix:[1.25,.85],wild:[1.1,.7]};
const FOODS=[['len','Lentils'],['chk','Chickpeas'],['bbn','Black beans'],['tofu','Tofu'],['edam','Edamame'],['egg','Eggs'],['yog','Greek yogurt'],['pan','Paneer'],['cot','Cottage cheese'],['spin','Spinach']];
const SW=[
['White rice','Half rice, half cooked lentils, or brown rice','about +8 g protein and more fiber','Cook them in the same pot.',1],
['Pasta','Chickpea or lentil pasta','about +10 g protein','Same 8 to 10 minute cook time.',1],
['Sweet cereal or plain toast','Oats with Greek yogurt and peanut butter','about +15 g protein','Overnight oats need no morning cooking.',0],
['Instant ramen','Ramen with an egg or tofu, frozen veg, and half the seasoning packet','about +12 g protein','Less sodium and still a five minute meal.',1],
['Burrito with lots of rice','Bean-heavy bowl with the tortilla on the side','about +6 g protein and more fiber','Beans replace half the rice.',1],
['White naan or white bread','Whole wheat roti, pita, or sprouted bread','about +3 g fiber','Buy the whole grain version of the same thing.',1],
['Fries or chips','Roasted chickpeas or microwaved edamame','about +10 g protein','Edamame takes 3 minutes.',1],
['Pizza night','Whole wheat pita pizza with paneer or tofu and veggies','about +12 g protein','Cheaper than takeout and ready in 15 minutes.',0],
['Biryani or pulao','Same dish with half the rice swapped for chickpeas or soy chunks','about +10 g protein','Keeps the flavor and adds protein.',1]
];
const R={
dal:["1/2 cup red lentils; 1 cup water; 1/4 onion, diced; 1/2 tomato or 2 tbsp canned tomatoes; 1/2 tsp turmeric; 1/2 tsp cumin; salt; 3/4 cup cooked rice","Rinse the lentils.|Simmer lentils with water, turmeric, and salt for 15 min until soft.|In a small pan, cook onion and cumin in a little oil for 5 min, then add tomato for 3 min.|Stir the onion mix into the dal and serve over rice."],
chana:["1/2 can chickpeas, drained; 1/4 onion, diced; 1/2 cup canned tomatoes; 1 tsp garam masala or curry powder; 1/2 tsp cumin; salt; 3/4 cup cooked rice","Cook onion with cumin in a little oil for 5 min.|Add tomatoes and spices, cook 5 min.|Add chickpeas and 1/4 cup water, simmer 10 min, mashing a few.|Serve over rice."],
palak:["3 oz paneer, cubed; 2 cups spinach; 1/4 onion; 1 clove garlic; 1 tsp curry powder; 1 tortilla or roti","Saute onion and garlic 4 min.|Add spinach and curry powder, cook until wilted, then mash roughly.|Add paneer and warm through 3 min.|Wrap in the tortilla."],
bhurji:["4 oz firm tofu, crumbled; 1/4 onion, diced; 1/2 tsp turmeric; 1/2 tsp cumin; salt; chili flakes; 1 tortilla","Cook onion in oil 3 min.|Add spices and crumbled tofu, stir for 5 min.|Wrap in the tortilla."],
bowl:["1/2 can black beans; 3/4 cup cooked rice; 1/4 cup salsa; 1/2 cup chopped pepper or cucumber; cumin and salt; lime if you have it","Warm beans with cumin and a splash of water for 4 min.|Layer rice, beans, vegetables, and salsa in a bowl."],
quesa:["1 tortilla; 1/3 can black beans, mashed; 1/4 cup shredded cheese or feta; salsa to serve","Spread beans and cheese on half the tortilla and fold it over.|Cook in a dry pan 2 to 3 min per side until crisp.|Cut and serve with salsa."],
huev:["2 eggs; 1 tortilla; 1/4 cup salsa or tomato-onion sauce","Warm the tortilla in a pan.|Fry the eggs.|Warm the salsa 2 min.|Put the eggs on the tortilla and top with salsa."],
pnut:["4 oz firm tofu, cubed; 1 cup frozen broccoli; 1 tbsp peanut butter; 1 tbsp soy sauce; 1 tbsp hot water; 3/4 cup cooked rice","Pan-fry tofu in oil 6 min until golden.|Add broccoli and cook 4 min.|Stir peanut butter, soy sauce, and hot water together, add to the pan, and toss 1 min.|Serve over rice."],
efr:["3/4 cup cooked rice, cold; 1/2 cup frozen edamame; 1/2 cup frozen broccoli; 1 egg; 1 tbsp soy sauce","Scramble the egg in oil and set it aside.|Fry the vegetables 4 min.|Add rice and soy sauce, stir 3 min.|Fold the egg back in."],
ceb:["1/2 can chickpeas, drained; 1/2 cup frozen edamame; 3/4 cup cooked rice; 1 tbsp soy sauce; sesame seeds or chili flakes","Microwave edamame 2 min.|Pan-toast chickpeas with soy sauce 5 min until slightly crisp.|Serve over rice with the edamame."],
bibi:["2 eggs; 3/4 cup cooked rice; 1 cup spinach; 1 tsp soy sauce; 1 tsp sesame oil; chili paste if you have it","Wilt the spinach in a pan 1 min and season with soy sauce.|Fry the eggs.|Put rice in a bowl, top with spinach and eggs, and add sesame oil."],
kdub:["4 oz firm tofu, sliced; 3/4 cup cooked rice; 1/2 cup sliced cucumber or pepper; 1 tbsp soy sauce; 1 tsp sesame oil; 1/2 tsp chili flakes","Pan-fry the tofu 3 to 4 min per side.|Toss with soy sauce and chili flakes.|Serve over rice with the vegetables and sesame oil."],
thai:["4 oz firm tofu, cubed; 2 oz noodles or pasta; 1/2 cup sliced peppers or cucumber; 1 tbsp peanut butter; 1 tbsp soy sauce; 1 tsp lime juice or vinegar; 1 tbsp hot water","Boil the noodles and drain.|Pan-fry tofu 6 min.|Whisk peanut butter, soy sauce, lime, and hot water into a sauce.|Toss everything together."],
omel:["3 eggs; 1 cup spinach; 2 tbsp feta; salt and pepper","Whisk eggs with salt and pepper.|Wilt spinach in a pan 1 min.|Pour eggs over, cook 2 min, add feta, fold, and cook 1 min more."],
chsal:["1/2 can chickpeas, drained; 1/2 cup diced cucumber; 1/4 cup diced pepper or tomato; 2 tbsp feta; 1 tsp olive oil; lemon juice or vinegar; salt","Mix everything in a bowl.|Season with lemon and salt. It tastes better if it sits 10 min."],
cotb:["1/2 cup cottage cheese; 1/2 can chickpeas, drained; 1/2 cup diced cucumber or pepper; salt, pepper, and lemon or hot sauce","Rinse and drain the chickpeas.|Stir everything together in a bowl and season."],
shak:["2 eggs; 1/2 cup canned tomatoes; 1/4 onion, diced; 1/2 tsp cumin; 1/2 tsp paprika; 1 pita","Cook onion 4 min.|Add tomatoes and spices, simmer 8 min.|Make two wells, crack in the eggs, cover, and cook 5 min.|Serve with warm pita."],
hum:["1/2 can chickpeas, drained; 1 tbsp olive oil; lemon juice; 1 clove garlic; 1/2 cup sliced cucumber and pepper; 1 pita or tortilla","Mash chickpeas with olive oil, lemon, garlic, salt, and a splash of water.|Spread on the pita, add the vegetables, and roll it up."],
misr:["1/2 cup red lentils; 1/4 onion, diced; 1 cup spinach; 1 tsp berbere or paprika with cumin; 1 cup water; salt","Cook onion in oil 5 min.|Add spice, lentils, water, and salt, and simmer 15 min.|Stir in spinach for the last 2 min.|Serve with bread or rice."],
lpas:["2 oz pasta; 1/3 cup red lentils; 1/2 cup canned tomatoes; 1/4 onion, diced; 1 clove garlic; Italian herbs and salt","Cook onion and garlic 4 min.|Add tomatoes, lentils, herbs, and 1 cup water, and simmer 15 min.|Boil the pasta separately and drain.|Toss together."],
oatb:["1/2 cup rolled oats; 3/4 cup Greek yogurt; 1 tbsp peanut butter; 1/2 cup milk or water; cinnamon or fruit if you like","Stir oats, yogurt, milk, and peanut butter together.|Rest 5 min, or overnight in the fridge. Eat cold or microwave 1 min."]
};
