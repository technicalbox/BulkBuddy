import smoothie from '@/assets/smoothie.jpg';
import bowl from '@/assets/paneer-bowl.jpg';
import oats from '@/assets/oats.jpg';
import toast from '@/assets/toast.jpg';
import eggs from '@/assets/egg-rice.jpg';
import photo from '@/assets/photo-sample.jpg';
export { photo };
export type Nutrition = { calories: number; protein: number; carbs: number; fat: number };
export type Food = Nutrition & { id: string; name: string; serving: string; category: string; image?: string };
export type Recipe = Food & { minutes: number; tags: string[]; ingredients: string[]; steps: string[] };
export const mealNames = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
export type MealName = typeof mealNames[number];
export const recipes: Recipe[] = [
 { id:'smoothie', name:'Peanut butter banana smoothie', serving:'1 glass · 400 ml', category:'Smoothies', image:smoothie, calories:620, protein:25, carbs:72, fat:26, minutes:5, tags:['Vegetarian','Quick','High calorie'], ingredients:['1 ripe banana','250 ml whole milk','2 tbsp peanut butter','40 g oats','1 tsp honey'], steps:['Add all ingredients to a blender.','Blend until smooth and creamy.','Pour into a glass and enjoy.'] },
 { id:'paneer', name:'Paneer rice bowl', serving:'1 bowl · 450 g', category:'Lunch & dinner', image:bowl, calories:740, protein:32, carbs:85, fat:30, minutes:20, tags:['Vegetarian','High protein','High calorie'], ingredients:['150 g paneer','180 g cooked rice','50 g chickpeas','A handful of spinach','15 g cashews','1 tsp olive oil'], steps:['Warm oil and sauté paneer until golden.','Add spinach and chickpeas; cook for 3 minutes.','Serve over warm rice and top with cashews.'] },
 { id:'toast', name:'Peanut butter toast', serving:'2 slices', category:'Breakfast', image:toast, calories:420, protein:14, carbs:48, fat:20, minutes:5, tags:['Vegan','Quick'], ingredients:['2 slices wholegrain bread','2 tbsp peanut butter','½ banana','A pinch of cinnamon'], steps:['Toast the bread until golden.','Spread peanut butter generously.','Top with banana slices and cinnamon.'] },
 { id:'oats', name:'Banana & nut overnight oats', serving:'1 bowl · 350 g', category:'Breakfast', image:oats, calories:580, protein:20, carbs:76, fat:22, minutes:10, tags:['Vegetarian','High calorie'], ingredients:['60 g rolled oats','200 ml whole milk','1 banana','20 g mixed nuts','1 tsp honey'], steps:['Mix oats and milk; refrigerate overnight.','Slice banana over the oats.','Add nuts and a drizzle of honey.'] },
 { id:'eggs', name:'Egg & avocado rice bowl', serving:'1 bowl · 400 g', category:'Lunch & dinner', image:eggs, calories:680, protein:24, carbs:70, fat:34, minutes:15, tags:['High calorie','Dairy free'], ingredients:['2 eggs','180 g cooked rice','½ avocado','1 tsp olive oil','Spring onions'], steps:['Fry eggs in olive oil to your liking.','Add rice and sliced avocado to a bowl.','Top with eggs and chopped spring onions.'] },
];
export const foods: Food[] = [
 ...recipes,
 {id:'banana',name:'Banana',serving:'1 medium · 118 g',category:'Fruit',calories:105,protein:1.3,carbs:27,fat:0.4},
 {id:'milk',name:'Whole milk',serving:'1 glass · 250 ml',category:'Dairy',calories:153,protein:8,carbs:12,fat:8},
 {id:'rice',name:'Cooked white rice',serving:'1 cup · 158 g',category:'Grains',calories:205,protein:4.3,carbs:45,fat:0.4},
 {id:'pb',name:'Peanut butter',serving:'2 tbsp · 32 g',category:'Nuts & seeds',calories:190,protein:7,carbs:7,fat:16},
 {id:'yogurt',name:'Greek yogurt',serving:'1 pot · 170 g',category:'Dairy',calories:120,protein:17,carbs:6,fat:3},
 {id:'chicken',name:'Grilled chicken breast',serving:'100 g',category:'Protein',calories:165,protein:31,carbs:0,fat:3.6},
];
export type Entry = Nutrition & { id:string; name:string; meal:MealName; serving:string; image?:string; day:number };
export const initialEntries:Entry[] = [
 {id:'seed-oats',name:'Banana & nut overnight oats',meal:'Breakfast',serving:'1 bowl',image:oats,day:11,calories:580,protein:20,carbs:76,fat:22},
 {id:'seed-paneer',name:'Paneer rice bowl',meal:'Lunch',serving:'1 bowl',image:bowl,day:11,calories:740,protein:32,carbs:85,fat:26},
 {id:'seed-yogurt',name:'Greek yogurt & banana',meal:'Snacks',serving:'1 serving',day:11,calories:270,protein:22,carbs:34,fat:5},
 {id:'seed-milk',name:'Whole milk & almonds',meal:'Snacks',serving:'1 glass + 10 g',day:11,calories:170,protein:8,carbs:20,fat:5},
];
export function scaleNutrition(n:Nutrition, quantity:number):Nutrition { return {calories:Math.round(n.calories*quantity),protein:Math.round(n.protein*quantity*10)/10,carbs:Math.round(n.carbs*quantity*10)/10,fat:Math.round(n.fat*quantity*10)/10}; }
export function sumNutrition(items:Nutrition[]):Nutrition { return items.reduce((a,n)=>({calories:Math.round(a.calories+n.calories),protein:Math.round((a.protein+n.protein)*10)/10,carbs:Math.round((a.carbs+n.carbs)*10)/10,fat:Math.round((a.fat+n.fat)*10)/10}),{calories:0,protein:0,carbs:0,fat:0}); }
export function scaleIngredient(ingredient:string, factor:number):string {
 if(factor===1)return ingredient;
 const normalized=ingredient.replace(/^½\s*/,'0.5 ').replace(/^¼\s*/,'0.25 ').replace(/^¾\s*/,'0.75 ');
 return normalized.replace(/^(\d+(?:\.\d+)?|\d+\/\d+)\b/,(match)=>{
  let num:number;
  if(match.includes('/')){const [n,d]=match.split('/');num=Number(n)/Number(d);}
  else{num=parseFloat(match);}
  const scaled=Math.round(num*factor*10)/10;
  return String(scaled);
 });
}
export const history = [{date:'Sep 14',weight:61.2,calories:2480,protein:105},{date:'Sep 21',weight:61.5,calories:2590,protein:112},{date:'Sep 28',weight:61.4,calories:2670,protein:108},{date:'Oct 2',weight:61.8,calories:2740,protein:119},{date:'Oct 5',weight:62.1,calories:2680,protein:116},{date:'Oct 8',weight:62.3,calories:2810,protein:124},{date:'Oct 11',weight:62.5,calories:2760,protein:120}];
export function pageHead(title:string,description:string){return {meta:[{title:`${title} — BulkBuddy`},{name:'description',content:description},{property:'og:title',content:`${title} — BulkBuddy`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
