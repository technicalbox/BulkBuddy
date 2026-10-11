import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { foods, history, initialEntries, scaleNutrition, sumNutrition, type Entry, type Food, type MealName } from './data';
export type Goals = { name:string; calories:number; protein:number; carbs:number; fat:number; targetWeight:string; units:'kg'|'lb'; diet:string; reminders:boolean; notifications:boolean; reducedMotion:boolean };
const defaultGoals:Goals = {name:'Salahuddin',calories:2800,protein:130,carbs:350,fat:90,targetWeight:'68',units:'kg',diet:'No restrictions',reminders:true,notifications:false,reducedMotion:false};
export type Weight = {date:string;weight:number;calories:number;protein:number};
function usePrototypeState(){
 const [entries,setEntries]=useState<Entry[]>(initialEntries);
 const [goals,setGoals]=useState<Goals>(defaultGoals);
 const [favorites,setFavorites]=useState<string[]>(['smoothie']);
 const [weights,setWeights]=useState<Weight[]>(history);
 const [day,setDay]=useState(11);
 const [recent,setRecent]=useState<string[]>(['banana','milk','pb']);
 const [notice,setNotice]=useState('');
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem('bulkbuddy-prototype-v1');if(raw){const v=JSON.parse(raw);if(Array.isArray(v.entries))setEntries(v.entries);if(v.goals)setGoals({...defaultGoals,...v.goals});if(Array.isArray(v.favorites))setFavorites(v.favorites);if(Array.isArray(v.weights))setWeights(v.weights);}}catch{setNotice('Your saved demo could not be restored. Sample data is ready.');}setHydrated(true);},[]);
 useEffect(()=>{if(!hydrated)return;try{localStorage.setItem('bulkbuddy-prototype-v1',JSON.stringify({entries,goals,favorites,weights}));}catch{setNotice('Browser storage is unavailable. Changes will last for this visit.');}},[entries,goals,favorites,weights,hydrated]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(t);},[notice]);
 const totals=sumNutrition(entries.filter(e=>e.day===day));
 const addFood=(food:Food,quantity:number,meal:MealName)=>{const image=food.image?{image:food.image}:{};setEntries(prev=>[...prev,{...scaleNutrition(food,quantity),id:crypto.randomUUID(),name:food.name,meal,serving:`${quantity} × ${food.serving}`,...image,day}]);setRecent(prev=>[food.id,...prev.filter(id=>id!==food.id)].slice(0,5));setNotice(`${food.name} added to ${meal.toLowerCase()}.`);};
 const removeEntry=(id:string)=>{setEntries(prev=>prev.filter(e=>e.id!==id));setNotice('Food removed. Your totals are updated.');};
 const toggleFavorite=(id:string)=>setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 const logWeight=(kg:number)=>{setWeights(prev=>[...prev,{date:'Oct 11',weight:kg,calories:totals.calories,protein:totals.protein}]);setNotice('Weight added to your local demo.');};
 const reset=()=>{setEntries(initialEntries);setGoals(defaultGoals);setFavorites(['smoothie']);setWeights(history);setDay(11);setNotice('Demo reset to its original sample data.');};
 return {entries,goals,setGoals,favorites,toggleFavorite,weights,setWeights,day,setDay,recentFoods:recent.map(id=>foods.find(f=>f.id===id)).filter((f):f is Food=>Boolean(f)),totals,addFood,removeEntry,logWeight,notice,setNotice,reset};
}
type Store=ReturnType<typeof usePrototypeState>;
const PrototypeContext=createContext<Store|null>(null);
export function PrototypeProvider({children}:{children:ReactNode}){const state=usePrototypeState();return <PrototypeContext.Provider value={state}><div className={state.goals.reducedMotion?'reduce-motion':''}>{children}</div></PrototypeContext.Provider>;}
export function usePrototype(){const store=useContext(PrototypeContext);if(!store)throw new Error('BulkBuddy provider missing');return store;}
